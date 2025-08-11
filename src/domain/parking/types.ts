export type Car = {
  registrationNo: string;
  color: string;
};

export type SlotRecord = {
  slot_no: number;
  registration_no: string;
  color: string;
};

export type InitRequest = { no_of_slot: number };
export type InitResponse = { total_slot: number };

export type ExpandRequest = { increment_slot: number };
export type ExpandResponse = { total_slot: number };

export type ParkRequest = { car_reg_no: string; car_color: string };
export type ParkResponse = { allocated_slot_number: number };

export type ClearBySlotRequest = { slot_number: number };
export type ClearByRegRequest = { car_registration_no: string };
export type ClearResponse = { freed_slot_number: number };
