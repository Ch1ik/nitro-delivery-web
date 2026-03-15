import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    if (this.socket?.connected) return;

    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinBusiness(businessId: string) {
    if (this.socket) {
      this.socket.emit('join-business', businessId);
    }
  }

  joinAdmin() {
    if (this.socket) {
      this.socket.emit('join-admin');
    }
  }

  onDeliveryCreated(callback: (delivery: any) => void) {
    if (this.socket) {
      this.socket.on('delivery-created', callback);
    }
  }

  onDeliveryStatusUpdated(callback: (delivery: any) => void) {
    if (this.socket) {
      this.socket.on('delivery-status-updated', callback);
    }
  }

  onDeliveryStopUpdated(callback: (data: { deliveryId: string; stopId: string; status: string }) => void) {
    if (this.socket) {
      this.socket.on('delivery-stop-updated', callback);
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const websocketService = new WebSocketService();
