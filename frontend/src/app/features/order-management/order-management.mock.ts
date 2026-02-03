import { Order } from './order-management.types';

export const MockServedOrders: Order[] = [
  {
    "_id": "69764ccea3877c5f88ff65cc",
    "tableNumber": "1",
    "items": [
      {
        "menuItemId": "69665607c118ba166e6edb2c",
        "name": "義大利麵",
        "price": 320,
        "quantity": 1,
        "customization": {
          "note": "",
          "客製化": "加麵"
        },
        "_id": "69764ccea3877c5f88ff65cd"
      }
    ],
    "total": 320,
    "status": "served",
    "token": "e13df289-5e48-4fbb-a775-67521d3677d2",
    "createdAt": "2026-01-25T17:03:10.414Z",
    "__v": 0
  }
];

export const MockPendingOrders: Order[] = [
  {
    "_id": "69764b7ba3877c5f88ff6520",
    "tableNumber": "2",
    "items": [
      {
        "menuItemId": "696674d542e901a71e29c6df",
        "name": "拉麵",
        "price": 280,
        "quantity": 1,
        "customization": {
          "note": "",
          "湯底": "鹽味"
        },
        "_id": "69764b7ba3877c5f88ff6521"
      },
      {
        "menuItemId": "69665506c118ba166e6edaa4",
        "name": "麻辣鍋",
        "price": 510,
        "quantity": 1,
        "customization": {
          "note": "",
          "辣度": "不辣",
          "加料": [
            "牛肉片",
            "豬肉片"
          ]
        },
        "_id": "69764b7ba3877c5f88ff6522"
      }
    ],
    "total": 790,
    "status": "pending",
    "token": "546c703f-ce5d-4ec8-9d04-6e4546029c1f",
    "createdAt": "2026-01-25T16:57:31.012Z",
    "__v": 0
  }
];
