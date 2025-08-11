import { MinHeap } from './MinHeap';
import type { Car, SlotRecord } from './types';

function normColor(color: string) { return color.trim().toLowerCase(); }
function normReg(reg: string) { return reg.trim().toUpperCase(); }

export class ParkingLot {
  private totalSlots = 0;
  private freeSlots = new MinHeap();
  private occupied = new Map<number, Car>();
  private regToSlot = new Map<string, number>();
  private colorToRegs = new Map<string, Set<string>>();
  private colorToSlots = new Map<string, Set<number>>();

  init(size: number) {
    if (!Number.isInteger(size) || size <= 0) throw new Error('no_of_slot must be a positive integer');
    this.totalSlots = size;
    this.freeSlots = new MinHeap(Array.from({ length: size }, (_, i) => i + 1));
    this.occupied.clear();
    this.regToSlot.clear();
    this.colorToRegs.clear();
    this.colorToSlots.clear();
    return { total_slot: this.totalSlots };
  }

  expand(increment: number) {
    if (!Number.isInteger(increment) || increment <= 0) throw new Error('increment_slot must be a positive integer');
    const start = this.totalSlots + 1;
    const end = this.totalSlots + increment;
    for (let s = start; s <= end; s++) this.freeSlots.push(s);
    this.totalSlots += increment;
    return { total_slot: this.totalSlots };
  }

  park(car: Car) {
    const reg = normReg(car.registrationNo);
    if (this.totalSlots === 0) throw new Error('Parking lot not initialized');
    if (this.freeSlots.size() === 0) throw new Error('Parking lot is full');
    if (this.regToSlot.has(reg)) throw new Error('Car already parked');
    const slot = this.freeSlots.pop()!;
    const c: Car = { registrationNo: reg, color: normColor(car.color) };
    this.occupied.set(slot, c);
    this.regToSlot.set(reg, slot);
    this.indexColor(slot, c);
    return { allocated_slot_number: slot };
  }

  private indexColor(slot: number, car: Car) {
    const clr = car.color;
    if (!this.colorToRegs.has(clr)) this.colorToRegs.set(clr, new Set());
    if (!this.colorToSlots.has(clr)) this.colorToSlots.set(clr, new Set());
    this.colorToRegs.get(clr)!.add(car.registrationNo);
    this.colorToSlots.get(clr)!.add(slot);
  }

  private deindexColor(slot: number, car: Car) {
    const clr = car.color;
    this.colorToRegs.get(clr)?.delete(car.registrationNo);
    this.colorToSlots.get(clr)?.delete(slot);
    if (this.colorToRegs.get(clr)?.size === 0) this.colorToRegs.delete(clr);
    if (this.colorToSlots.get(clr)?.size === 0) this.colorToSlots.delete(clr);
  }

  clearBySlot(slot: number) {
    if (!Number.isInteger(slot) || slot <= 0 || slot > this.totalSlots) throw new Error('Invalid slot number');
    const car = this.occupied.get(slot);
    if (!car) throw new Error('Slot is already free');
    this.occupied.delete(slot);
    this.regToSlot.delete(car.registrationNo);
    this.deindexColor(slot, car);
    this.freeSlots.push(slot);
    return { freed_slot_number: slot };
  }

  clearByReg(reg: string) {
    const nreg = normReg(reg);
    const slot = this.regToSlot.get(nreg);
    if (!slot) throw new Error('Car not found');
    return this.clearBySlot(slot);
  }

  getStatus(): SlotRecord[] {
    const res: SlotRecord[] = [];
    for (const [slot, car] of this.occupied.entries()) {
      res.push({ slot_no: slot, registration_no: car.registrationNo, color: car.color });
    }
    res.sort((a, b) => a.slot_no - b.slot_no);
    return res;
  }

  getRegistrationsByColor(color: string): string[] {
    return Array.from(this.colorToRegs.get(normColor(color)) ?? []);
  }

  getSlotsByColor(color: string): number[] {
    return Array.from(this.colorToSlots.get(normColor(color)) ?? []).sort((a, b) => a - b);
  }

  getSlotByRegistration(reg: string): number | null {
    return this.regToSlot.get(normReg(reg)) ?? null;
  }
}

export const parkingLot = new ParkingLot();
