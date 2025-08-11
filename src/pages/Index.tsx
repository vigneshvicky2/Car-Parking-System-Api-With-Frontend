import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Helmet, HelmetProvider } from 'react-helmet-async';

interface StatusItem { slot_no: number; registration_no: string; color: string }

const api = {
  init: async (n: number) => fetch('/api/parking_lot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ no_of_slot: n }) }).then(r => r.json()),
  expand: async (n: number) => fetch('/api/parking_lot', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ increment_slot: n }) }).then(r => r.json()),
  park: async (reg: string, color: string) => fetch('/api/park', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ car_reg_no: reg, car_color: color }) }).then(r => r.json()),
  clearBySlot: async (slot: number) => fetch('/api/clear', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slot_number: slot }) }).then(r => r.json()),
  clearByReg: async (reg: string) => fetch('/api/clear', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ car_registration_no: reg }) }).then(r => r.json()),
  status: async (): Promise<StatusItem[]> => fetch('/api/status').then(r => r.json()),
};

const Index = () => {
  const [inited, setInited] = useState(false);
  const [initSlots, setInitSlots] = useState('');
  const [expandSlots, setExpandSlots] = useState('');
  const [reg, setReg] = useState('');
  const [color, setColor] = useState('');
  const [clearSlot, setClearSlot] = useState('');
  const [clearReg, setClearReg] = useState('');
  const [status, setStatus] = useState<StatusItem[]>([]);

  const title = 'Car Parking System';
  const description = 'Interact with a beautifully simulated REST API for a car parking system with nearest-slot allocation.';

  const reload = async () => {
    const s = await api.status();
    setStatus(s);
  };

  useEffect(() => {
    reload();
  }, []);

  const onInit = async () => {
    const n = parseInt(initSlots, 10);
    const res = await api.init(n);
    if (res.error) return toast({ title: 'Error', description: res.error });
    setInited(true);
    toast({ title: 'Parking lot initialized', description: `Total slots: ${res.total_slot}` });
    reload();
  };

  const onExpand = async () => {
    const n = parseInt(expandSlots, 10);
    const res = await api.expand(n);
    if (res.error) return toast({ title: 'Error', description: res.error });
    toast({ title: 'Parking lot expanded', description: `Total slots: ${res.total_slot}` });
    reload();
  };

  const onPark = async () => {
    const res = await api.park(reg, color);
    if (res.error) return toast({ title: 'Error', description: res.error });
    toast({ title: 'Car parked', description: `Allocated slot: ${res.allocated_slot_number}` });
    setReg(''); setColor('');
    reload();
  };

  const onClearSlot = async () => {
    const n = parseInt(clearSlot, 10);
    const res = await api.clearBySlot(n);
    if (res.error) return toast({ title: 'Error', description: res.error });
    toast({ title: 'Slot freed', description: `Freed slot: ${res.freed_slot_number}` });
    setClearSlot('');
    reload();
  };

  const onClearReg = async () => {
    const res = await api.clearByReg(clearReg);
    if (res.error) return toast({ title: 'Error', description: res.error });
    toast({ title: 'Slot freed', description: `Freed slot: ${res.freed_slot_number}` });
    setClearReg('');
    reload();
  };

  const occupiedCount = useMemo(() => status.length, [status]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Parking API Playground",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web",
          "description": description
        })}</script>
      </Helmet>
      <main className="min-h-screen bg-background">
        <section id="init" className="container grid gap-6 md:grid-cols-2 py-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Initialize Parking Lot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="init-slots">Number of slots</Label>
                <Input id="init-slots" type="number" min={1} value={initSlots} onChange={(e) => setInitSlots(e.target.value)} placeholder="e.g. 6" />
              </div>
              <Button onClick={onInit}>Initialize</Button>
              {inited && <p className="text-sm text-muted-foreground">Parking lot is ready. Expand or start parking cars.</p>}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Expand Parking Lot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="expand-slots">Add slots</Label>
                <Input id="expand-slots" type="number" min={1} value={expandSlots} onChange={(e) => setExpandSlots(e.target.value)} placeholder="e.g. 3" />
              </div>
              <Button variant="secondary" onClick={onExpand}>Expand</Button>
              <p className="text-xs text-muted-foreground">Adds new slots continuing from the highest number.</p>
            </CardContent>
          </Card>
        </section>

        <section className="container grid gap-6 md:grid-cols-2 py-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Park a Car</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="reg">Registration number</Label>
                <Input id="reg" value={reg} onChange={(e) => setReg(e.target.value)} placeholder="KA-01-AB-2211" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="white" />
              </div>
              <Button onClick={onPark}>Allocate Slot</Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Clear a Slot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="clear-slot">By slot number</Label>
                <Input id="clear-slot" type="number" min={1} value={clearSlot} onChange={(e) => setClearSlot(e.target.value)} placeholder="1" />
                <Button variant="outline" onClick={onClearSlot}>Free Slot</Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clear-reg">By registration number</Label>
                <Input id="clear-reg" value={clearReg} onChange={(e) => setClearReg(e.target.value)} placeholder="KA-01-AB-2211" />
                <Button variant="outline" onClick={onClearReg}>Free by Registration</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="status" className="container py-8">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-semibold">Occupied Slots</h2>
            <p className="text-sm text-muted-foreground">Total occupied: {occupiedCount}</p>
          </div>
          <div className="mt-4 overflow-x-auto rounded-md border">
            <table className="w-full text-left">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2">Slot</th>
                  <th className="px-4 py-2">Registration</th>
                  <th className="px-4 py-2">Color</th>
                </tr>
              </thead>
              <tbody>
                {status.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-muted-foreground" colSpan={3}>No cars parked yet.</td>
                  </tr>
                ) : (
                  status.map((s) => (
                    <tr key={s.slot_no} className="border-t">
                      <td className="px-4 py-2">{s.slot_no}</td>
                      <td className="px-4 py-2">{s.registration_no}</td>
                      <td className="px-4 py-2 capitalize">{s.color}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="container py-10 text-center text-sm text-muted-foreground">
          Built with TypeScript, MSW, and a min-heap allocator for O(log n) nearest-slot allocation.
        </footer>
      </main>
    </HelmetProvider>
  );
};

export default Index;
