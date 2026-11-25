/**
 * View Restaurant & Café - Firebase Configuration and Data Service
 * Project: view-restaurant-and-coffe
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAnalytics, isSupported as isAnalyticsSupported } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  setDoc,
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBy6MG73rCI8PusVST6Mj7sI64R4vN8EHI",
  authDomain: "view-restaurant-and-coffe.firebaseapp.com",
  projectId: "view-restaurant-and-coffe",
  storageBucket: "view-restaurant-and-coffe.firebasestorage.app",
  messagingSenderId: "445303018686",
  appId: "1:445303018686:web:1ce4e73d0997cf5729baef",
  measurementId: "G-T998ESKZV9"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Analytics if supported in this environment
export let analytics = null;
isAnalyticsSupported().then(supported => {
  if (supported) {
    try {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized successfully");
    } catch (e) {
      console.warn("Analytics initialization skipped:", e.message);
    }
  }
}).catch(() => {});

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Local Storage Fallback Keys
const LOCAL_RESERVATIONS_KEY = "view_restaurant_reservations";
const LOCAL_ORDERS_KEY = "view_restaurant_orders";
const LOCAL_MENU_KEY = "view_restaurant_menu";
const LOCAL_MESSAGES_KEY = "view_restaurant_messages";

function getLocalData(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocalData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
}

/**
 * ============================================
 * RESERVATIONS SERVICE
 * ============================================
 */
export async function saveReservation(reservationData) {
  const record = {
    ...reservationData,
    createdAt: new Date().toISOString(),
    status: reservationData.status || "Confirmed",
    referenceId: reservationData.referenceId || "VW-" + Math.floor(100000 + Math.random() * 900000)
  };

  // Always save locally for instant offline feedback
  const localList = getLocalData(LOCAL_RESERVATIONS_KEY);
  localList.unshift(record);
  setLocalData(LOCAL_RESERVATIONS_KEY, localList);

  try {
    const docRef = await addDoc(collection(db, "reservations"), {
      ...record,
      timestamp: serverTimestamp()
    });
    record.id = docRef.id;
    console.log("Reservation stored in Firebase Firestore with ID:", docRef.id);
    return { success: true, id: docRef.id, referenceId: record.referenceId, record, source: "firestore" };
  } catch (error) {
    console.warn("Firestore save reservation failed (falling back to local cache):", error.message);
    return { success: true, id: record.referenceId, referenceId: record.referenceId, record, source: "local", error: error.message };
  }
}

export function subscribeReservations(callback) {
  try {
    const q = query(collection(db, "reservations"), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() });
      });
      callback(items);
    }, (error) => {
      console.warn("Firestore snapshot error (using local storage):", error.message);
      callback(getLocalData(LOCAL_RESERVATIONS_KEY));
    });
  } catch (error) {
    console.warn("Realtime listener failed, falling back to local storage:", error.message);
    callback(getLocalData(LOCAL_RESERVATIONS_KEY));
    return () => {};
  }
}

export async function deleteReservation(id) {
  // Update local storage
  let localList = getLocalData(LOCAL_RESERVATIONS_KEY);
  localList = localList.filter(item => item.id !== id && item.referenceId !== id);
  setLocalData(LOCAL_RESERVATIONS_KEY, localList);

  try {
    await deleteDoc(doc(db, "reservations", id));
    return { success: true };
  } catch (error) {
    console.warn("Firestore delete failed:", error.message);
    return { success: true, note: "Deleted locally" };
  }
}

/**
 * ============================================
 * ORDERS SERVICE (KITCHEN & CART)
 * ============================================
 */
export const ORDER_STATUSES = {
  RECEIVED: "تم استلام الطلب 📋",
  PREPARING: "قيد التحضير والتجميع بالمطبخ 🍳",
  WITH_DELIVERY: "مع المندوب للتوصيل 🛵",
  DELIVERED: "تم التسليم والاستلام ✅",
  CANCELLED: "ملغي من قبل العميل ❌"
};

// Web Audio API Order Chimes (no external audio files needed)
export function playNotificationSound(type = 'new_order') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'new_order') {
      // 2-tone kitchen order bell (D5 -> A5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.55);
    } else if (type === 'delivery') {
      // 3-tone cheerful motorcycle/delivery alert (C5 -> E5 -> G5)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === 'delivered') {
      // Fanfare celebration chime (E5 -> G#5 -> B5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.setValueAtTime(830.61, ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(987.77, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.7);
    }
  } catch (e) {
    console.debug('Audio notification skipped:', e.message);
  }
}

export async function saveOrder(orderData) {
  const numPart = Math.floor(1000 + Math.random() * 9000);
  const rawNum = orderData.orderNumber || "#ORD-" + numPart;
  const numOnly = String(rawNum).replace(/[^0-9]/g, '') || String(numPart);
  const safeId = "ORD-" + numOnly;
  const formattedOrderNumber = "#ORD-" + numOnly;

  const orderRecord = {
    ...orderData,
    id: safeId,
    orderNumber: formattedOrderNumber,
    status: orderData.status || ORDER_STATUSES.PREPARING,
    statusStep: orderData.statusStep || 2,
    createdAt: orderData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 1. Always update local storage cache immediately
  const localOrders = getLocalData(LOCAL_ORDERS_KEY);
  const filtered = localOrders.filter(o => o.id !== safeId && o.orderNumber !== formattedOrderNumber);
  filtered.unshift(orderRecord);
  setLocalData(LOCAL_ORDERS_KEY, filtered);

  // Set as active order in local storage
  try {
    localStorage.setItem("view_active_order", JSON.stringify(orderRecord));
  } catch (e) {}

  // Broadcast event across windows / components
  try {
    window.dispatchEvent(new CustomEvent("ViewOrderStatusChanged", {
      detail: { orderId: safeId, orderNumber: formattedOrderNumber, status: orderRecord.status, step: orderRecord.statusStep, order: orderRecord }
    }));
  } catch(e) {}

  try {
    const bc = new BroadcastChannel("view_orders_channel");
    bc.postMessage({
      type: "NEW_ORDER",
      orderId: safeId,
      orderNumber: formattedOrderNumber,
      order: orderRecord
    });
  } catch(e) {}

  // 2. Save into Firestore with consistent document ID
  try {
    await setDoc(doc(db, "orders", safeId), {
      ...orderRecord,
      timestamp: serverTimestamp()
    });
    console.log("Order saved to Firestore with ID:", safeId);
    return { success: true, id: safeId, orderNumber: formattedOrderNumber, order: orderRecord, source: "firestore" };
  } catch (error) {
    console.warn("Firestore save order failed (using local fallback):", error.message);
    return { success: true, id: safeId, orderNumber: formattedOrderNumber, order: orderRecord, source: "local" };
  }
}

export function subscribeOrders(callback) {
  let unsubscribe = () => {};

  // Instant local rendering
  const initialLocal = getLocalData(LOCAL_ORDERS_KEY);
  if (initialLocal && initialLocal.length > 0) {
    callback(initialLocal);
  }

  try {
    const colRef = collection(db, "orders");
    unsubscribe = onSnapshot(colRef, (snapshot) => {
      const orders = [];
      snapshot.forEach(d => {
        orders.push({ id: d.id, ...d.data() });
      });

      // Sort client-side descending by timestamp or date
      orders.sort((a, b) => {
        const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : new Date(a.createdAt || 0).getTime();
        const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      // Merge any local-only orders that may not be in Firestore yet
      const local = getLocalData(LOCAL_ORDERS_KEY);
      local.forEach(loc => {
        if (!orders.some(o => o.id === loc.id || o.orderNumber === loc.orderNumber)) {
          orders.push(loc);
        }
      });

      callback(orders);
    }, (error) => {
      console.warn("Firestore orders listener fallback to local storage:", error.message);
      callback(getLocalData(LOCAL_ORDERS_KEY));
    });
  } catch (error) {
    console.warn("Realtime listener failed:", error.message);
    callback(getLocalData(LOCAL_ORDERS_KEY));
  }

  return unsubscribe;
}

export async function updateOrderStatus(orderIdentifier, newStatus, newStep = null, extraData = {}) {
  const cleanStr = String(orderIdentifier || "").trim();
  const safeId = cleanStr.replace(/[^a-zA-Z0-9_-]/g, "");
  const numOnly = cleanStr.replace(/[^0-9]/g, "");
  const withHash = cleanStr.startsWith('#') ? cleanStr : ('#' + cleanStr);

  // Determine standard step if not provided
  let step = newStep;
  if (!step) {
    if (newStatus.includes("توصيل") || newStatus.includes("المندوب")) {
      step = 3;
    } else if (newStatus.includes("تم التسليم") || newStatus.includes("استلام") || newStatus.includes("مكتمل")) {
      step = 4;
    } else if (newStatus.includes("تحضير") || newStatus.includes("تجميع")) {
      step = 2;
    } else if (newStatus.includes("ملغي")) {
      step = 0;
    } else {
      step = 2;
    }
  }

  const matchesOrder = (o) => {
    if (!o) return false;
    const oId = String(o.id || "");
    const oNum = String(o.orderNumber || "");
    const oClean = oNum.replace(/[^a-zA-Z0-9_-]/g, "");
    const oNumOnly = oNum.replace(/[^0-9]/g, "");
    return oId === cleanStr || oId === safeId || oNum === cleanStr || oNum === withHash ||
           oClean === safeId || (numOnly && oNumOnly === numOnly);
  };

  // 1. Update local storage
  const localOrders = getLocalData(LOCAL_ORDERS_KEY);
  let updatedOrder = null;
  localOrders.forEach(o => {
    if (matchesOrder(o)) {
      o.status = newStatus;
      o.statusStep = step;
      o.updatedAt = new Date().toISOString();
      if (extraData && typeof extraData === 'object') {
        Object.assign(o, extraData);
      }
      updatedOrder = o;
    }
  });
  setLocalData(LOCAL_ORDERS_KEY, localOrders);

  // 2. Update active order if matched or current
  try {
    const rawActive = localStorage.getItem("view_active_order");
    if (rawActive) {
      const active = JSON.parse(rawActive);
      if (matchesOrder(active) || cleanStr === "CURRENT_ACTIVE") {
        active.status = newStatus;
        active.statusStep = step;
        active.updatedAt = new Date().toISOString();
        if (extraData && typeof extraData === 'object') {
          Object.assign(active, extraData);
        }
        localStorage.setItem("view_active_order", JSON.stringify(active));
      }
    }
  } catch (e) {}

  // 3. Dispatch broadcast event for realtime tabs/listeners
  try {
    window.dispatchEvent(new CustomEvent("ViewOrderStatusChanged", {
      detail: { orderId: orderIdentifier, status: newStatus, step: step, extraData: extraData }
    }));
  } catch (e) {}

  // Cross-window BroadcastChannel
  try {
    const bc = new BroadcastChannel("view_orders_channel");
    bc.postMessage({
      type: "ORDER_STATUS_UPDATED",
      orderId: orderIdentifier,
      status: newStatus,
      step: step,
      extraData: extraData
    });
  } catch(e) {}

  // 4. Update in Firestore
  try {
    let directSucceeded = false;
    const candidates = [safeId, cleanStr, "ORD-" + numOnly].filter(Boolean);

    for (const cid of candidates) {
      try {
        await updateDoc(doc(db, "orders", cid), {
          status: newStatus,
          statusStep: step,
          updatedAt: serverTimestamp(),
          ...(extraData && typeof extraData === 'object' ? extraData : {})
        });
        directSucceeded = true;
        break;
      } catch (e) {}
    }

    if (!directSucceeded) {
      const snap = await getDocs(collection(db, "orders"));
      for (const d of snap.docs) {
        const data = d.data();
        if (matchesOrder({ id: d.id, ...data })) {
          await updateDoc(doc(db, "orders", d.id), {
            status: newStatus,
            statusStep: step,
            updatedAt: serverTimestamp()
          });
          directSucceeded = true;
        }
      }
    }

    return { success: true, updated: directSucceeded };
  } catch (error) {
    console.warn("Firestore updateOrderStatus fallback:", error.message);
    return { success: true, note: "Updated locally" };
  }
}

/**
 * ============================================
 * MENU ITEMS SERVICE
 * ============================================
 */
export async function saveMenuItem(dishData) {
  const dish = {
    ...dishData,
    createdAt: new Date().toISOString()
  };

  const localMenu = getLocalData(LOCAL_MENU_KEY);
  localMenu.push(dish);
  setLocalData(LOCAL_MENU_KEY, localMenu);

  try {
    const docRef = await addDoc(collection(db, "menu_items"), {
      ...dish,
      timestamp: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: true, id: "local-" + Date.now() };
  }
}

export function subscribeMenuItems(callback) {
  try {
    return onSnapshot(collection(db, "menu_items"), (snapshot) => {
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      callback(items);
    }, () => {
      callback(getLocalData(LOCAL_MENU_KEY));
    });
  } catch (e) {
    callback(getLocalData(LOCAL_MENU_KEY));
    return () => {};
  }
}

/**
 * ============================================
 * CONTACT & MESSAGES
 * ============================================
 */
export async function saveContactMessage(msgData) {
  const msg = { ...msgData, createdAt: new Date().toISOString() };
  const msgs = getLocalData(LOCAL_MESSAGES_KEY);
  msgs.unshift(msg);
  setLocalData(LOCAL_MESSAGES_KEY, msgs);

  try {
    const docRef = await addDoc(collection(db, "messages"), {
      ...msg,
      timestamp: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: true, id: "msg-" + Date.now() };
  }
}

// Attach to window for easy access across any vanilla JS code
if (typeof window !== "undefined") {
  window.ViewFirebase = {
    app,
    db,
    analytics,
    saveReservation,
    subscribeReservations,
    deleteReservation,
    saveOrder,
    subscribeOrders,
    updateOrderStatus,
    saveMenuItem,
    subscribeMenuItems,
    saveContactMessage,
    ORDER_STATUSES,
    playNotificationSound
  };
  window.dispatchEvent(new CustomEvent("ViewFirebaseReady"));
  console.log("🔥 View Restaurant Firebase Services attached to window.ViewFirebase");
}
