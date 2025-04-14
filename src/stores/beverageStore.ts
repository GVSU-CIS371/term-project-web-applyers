import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import db from "../firebase.ts";
import {
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,
    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,
    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,
    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,
    currentName: "",
  }),

  actions: {
    async init() {
      try {
        const baseSnap = await getDocs(collection(db, "bases"));
        const syrupSnap = await getDocs(collection(db, "syrups"));
        const creamerSnap = await getDocs(collection(db, "creamers"));
  
        this.bases = baseSnap.docs.map((doc) => doc.data() as BaseBeverageType);
        this.syrups = syrupSnap.docs.map((doc) => doc.data() as SyrupType);
        this.creamers = creamerSnap.docs.map((doc) => doc.data() as CreamerType);
  
        this.currentBase = this.bases[0] ?? null;
        this.currentSyrup = this.syrups[0] ?? null;
        this.currentCreamer = this.creamers[0] ?? null;

        console.log("[Store] Bases loaded:", this.bases);
        console.log("[Store] Syrups loaded:", this.syrups);
        console.log("[Store] Creamers loaded:", this.creamers);

      } catch (error) {
        console.error("Error initializing beverage store:", error);
      }
    },
      
    async makeBeverage() {
      try {
        if (!this.currentBase || !this.currentSyrup || !this.currentCreamer || !this.currentName) {
          console.warn("Missing data for beverage creation.");
          return;
        }
    
        const id = crypto.randomUUID(); // I kept getting an ID error, adding this to fix it
    
        const beverage: BeverageType = {
          id,
          name: this.currentName,
          temp: this.currentTemp,
          base: this.currentBase,
          syrup: this.currentSyrup,
          creamer: this.currentCreamer,
        };
    
        console.log("[makeBeverage] Saving beverage:", beverage);
    
        await setDoc(doc(db, "beverages", id), beverage);
        this.beverages.push(beverage);
    
        console.log("[makeBeverage] Beverage saved successfully.");
      } catch (error) {
        console.error("Failed to save beverage:", error);
      }
    },

    showBeverage(id: string) {
      const selected = this.beverages.find((bev) => bev.id === id);
      if (selected) {
        this.currentBeverage = selected;
        this.currentName = selected.name;
        this.currentTemp = selected.temp;
        this.currentBase = selected.base;
        this.currentSyrup = selected.syrup;
        this.currentCreamer = selected.creamer;
      } else {
        console.warn("Beverage not found");
      }
    }
  }
  
});
