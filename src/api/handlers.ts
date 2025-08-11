/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { parkingLot } from '@/domain/parking/ParkingLot';

export const handlers = [
  http.post('/api/parking_lot', async ({ request }) => {
    const body: any = await request.json();
    try {
      const res = parkingLot.init(body.no_of_slot);
      return HttpResponse.json(res, { status: 201 });
    } catch (e: any) {
      return HttpResponse.json({ error: e.message }, { status: 400 });
    }
  }),

  http.patch('/api/parking_lot', async ({ request }) => {
    const body: any = await request.json();
    try {
      const res = parkingLot.expand(body.increment_slot);
      return HttpResponse.json(res, { status: 200 });
    } catch (e: any) {
      return HttpResponse.json({ error: e.message }, { status: 400 });
    }
  }),

  http.post('/api/park', async ({ request }) => {
    const body: any = await request.json();
    try {
      const res = parkingLot.park({ registrationNo: body.car_reg_no, color: body.car_color });
      return HttpResponse.json(res, { status: 201 });
    } catch (e: any) {
      return HttpResponse.json({ error: e.message }, { status: 400 });
    }
  }),

  http.get('/api/registration_numbers/:color', ({ params }) => {
    const { color } = params as { color: string };
    const res = parkingLot.getRegistrationsByColor(color);
    return HttpResponse.json(res, { status: 200 });
  }),

  http.get('/api/slot_numbers/:color', ({ params }) => {
    const { color } = params as { color: string };
    const res = parkingLot.getSlotsByColor(color);
    return HttpResponse.json(res, { status: 200 });
  }),

  http.get('/api/slot/:registration', ({ params }) => {
    const { registration } = params as { registration: string };
    const slot = parkingLot.getSlotByRegistration(registration);
    if (slot === null) {
      return HttpResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    return HttpResponse.json({ slot_number: slot }, { status: 200 });
  }),

  http.post('/api/clear', async ({ request }) => {
    const body: any = await request.json();
    try {
      if (typeof body.slot_number === 'number') {
        const res = parkingLot.clearBySlot(body.slot_number);
        return HttpResponse.json(res, { status: 200 });
      }
      if (typeof body.car_registration_no === 'string') {
        const res = parkingLot.clearByReg(body.car_registration_no);
        return HttpResponse.json(res, { status: 200 });
      }
      return HttpResponse.json({ error: 'Provide slot_number or car_registration_no' }, { status: 400 });
    } catch (e: any) {
      return HttpResponse.json({ error: e.message }, { status: 400 });
    }
  }),

  http.get('/api/status', () => {
    return HttpResponse.json(parkingLot.getStatus(), { status: 200 });
  }),

  http.get('/api/health', () => HttpResponse.json({ ok: true }, { status: 200 })),
];
