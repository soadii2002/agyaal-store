import api from "./api";

export const cartService = {
  get:    ()           => api.get("/cart"),
  add:    (data)       => api.post("/cart", data),
  update: (itemId, qty) => api.put(`/cart/${itemId}`, { quantity: qty }),
  remove: (itemId)     => api.delete(`/cart/${itemId}`),
  clear:  ()           => api.delete("/cart/clear"),
};

export const orderService = {
  create:     (data) => api.post("/orders", data),
  getMyOrders: ()    => api.get("/orders/myorders"),
  getById:    (id)   => api.get(`/orders/${id}`),
  getAll:     ()     => api.get("/orders"),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

export const categoryService = {
  getAll:  ()       => api.get("/categories"),
  getById: (id)     => api.get(`/categories/${id}`),
  create:  (data)   => api.post("/categories", data, { headers: { "Content-Type": "multipart/form-data" } }),
  update:  (id, data) => api.put(`/categories/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  delete:  (id)     => api.delete(`/categories/${id}`),
};

export const userService = {
  getAll:     ()     => api.get("/users"),
  getById:    (id)   => api.get(`/users/${id}`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  delete:     (id)   => api.delete(`/users/${id}`),
};

export const reviewService = {
  getByProduct: (productId) => api.get(`/reviews/${productId}`),
  create: (productId, data) => api.post(`/reviews/${productId}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const messageService = {
  create: (data) => api.post("/messages", data),
  getAll: () => api.get("/messages"),
  getMyMessages: () => api.get("/messages/my-messages"),
  reply: (id, text) => api.put(`/messages/${id}/reply`, { replyText: text }),
  delete: (id) => api.delete(`/messages/${id}`),
};
