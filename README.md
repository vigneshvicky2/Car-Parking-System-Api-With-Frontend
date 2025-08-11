# 🚗 Car Parking System – Full Stack Intern Assessment

## 📌 Overview

This project implements a **RESTful API** for a **Car Parking System** as per the [GyanPlug Full Stack Developer Intern Assessment](./FULL%20STACK%20INTERN%20ASSESSMENT.pdf).
It allows vehicles to enter, park, and exit automatically without human intervention. The system manages parking slots, allocates nearest available slots, and retrieves parking-related details.

---

## 🛠 Features

* **Initialize Parking Lot** with a fixed number of slots.
* **Expand Parking Lot** by adding more slots.
* **Allocate Slot** to a car upon entry.
* **Free Slot** when a car leaves.
* **Fetch Occupied Slots** with car details.
* **Search by Car Color**:

  * Get **registration numbers** of all cars with a given color.
  * Get **slot numbers** for all cars with a given color.
* **Search by Registration Number**:

  * Find slot number where the car is parked.
* **Error Handling** for invalid or unavailable slots.
* **Extensible** for adding more features.

---

## ⚙️ Tech Stack

* **Backend**: [NestJS](https://nestjs.com/) (TypeScript)
* **Data Storage**: In-memory (Array / Map)
* **API Style**: REST
* **Testing**: Unit tests with [Jest](https://jestjs.io/)
* **Containerization (Optional)**: Docker

---

## 🚀 API Endpoints

### 1️⃣ Initialize Parking Lot

```
POST /parking_lot
Body:
{
  "no_of_slot": 6
}
Response:
{
  "total_slot": 6
}
```

### 2️⃣ Expand Parking Lot

```
PATCH /parking_lot
Body:
{
  "increment_slot": 3
}
Response:
{
  "total_slot": 9
}
```

### 3️⃣ Allocate Slot to Car

```
POST /park
Body:
{
  "car_reg_no": "KA-01-AB-2211",
  "car_color": "white"
}
Response:
{
  "allocated_slot_number": 1
}
```

### 4️⃣ Get Registration Numbers by Color

```
GET /registration_numbers/:color
Response:
[
  "KA-01-HH-1234",
  "KA-02-AB-9999",
  "KA-03-PK-2211"
]
```

### 5️⃣ Get Slot Numbers by Color

```
GET /slot_numbers/:color
Response:
[
  "1",
  "5",
  "12"
]
```

### 6️⃣ Free Slot

```
POST /clear
Body:
{
  "slot_number": 1
}
Response:
{
  "freed_slot_number": 1
}
```

**OR**

```
Body:
{
  "car_registration_no": "KA-01-AB-2211"
}
Response:
{
  "freed_slot_number": 1
}
```

### 7️⃣ Get Parking Lot Status

```
GET /status
Response:
[
  { "slot_no": 1, "registration_no": "KA-01-HH-1234", "color": "red" },
  { "slot_no": 2, "registration_no": "KA-01-HH-1235", "color": "blue" }
]
```

---

## 🧠 Assumptions

* Nearest slot allocation is based on the **smallest available slot number**.
* Slot numbers are **incremental** from the entry point.
* If parking is full, `/park` returns an error.
* A free slot operation fails if:

  * The slot is already empty.
  * The car registration number does not exist.



## 🧪 Running Locally

### Prerequisites

* [Node.js](https://nodejs.org/) (>= 18.x)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Install Dependencies

```bash
npm install
```

### Start Server

```bash
npm run start:dev
```

## ✨ Future Enhancements

* Authentication & Authorization
* Parking history tracking
* Pricing system for parking durations
* Multiple entry/exit points with allocation logic
* Persistent storage integration (DB)
If you want, I can now also **add API documentation using Swagger** so this README looks professional and can serve as a full API reference.
Do you want me to include that?
