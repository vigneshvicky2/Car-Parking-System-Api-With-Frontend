export class MinHeap {
  private heap: number[] = [];

  constructor(initial?: number[]) {
    if (initial && initial.length) {
      this.heap = initial.slice();
      this.heapify();
    }
  }

  private heapify() {
    if (this.heap.length <= 1) return;
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.sink(i);
    }
  }

  private swim(i: number) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[p] <= this.heap[i]) break;
      this.swap(p, i);
      i = p;
    }
  }

  private sink(i: number) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;
      if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;
      if (smallest === i) break;
      this.swap(i, smallest);
      i = smallest;
    }
  }

  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  push(x: number) {
    this.heap.push(x);
    this.swim(this.heap.length - 1);
  }

  pop(): number | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sink(0);
    }
    return top;
  }

  peek(): number | undefined {
    return this.heap[0];
  }

  size(): number {
    return this.heap.length;
  }

  toArray(): number[] {
    return this.heap.slice();
  }
}
