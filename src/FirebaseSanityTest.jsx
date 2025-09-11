// FirebaseSanityTest.jsx
import { useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function FirebaseSanityTest() {
  useEffect(() => {
    (async () => {
      try {
        const ref = doc(db, "sanity", "writeReadTest");
        await setDoc(ref, { ok: true, at: serverTimestamp() }, { merge: true });
        const snap = await getDoc(ref);
        console.log("Firestore OK:", snap.exists(), snap.data());
      } catch (e) {
        console.error("Firestore error ▶", e);
      }
    })();
  }, []);
  return null;
}
