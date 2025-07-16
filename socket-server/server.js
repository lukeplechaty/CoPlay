import { createServer } from "http";
import { Server as SocketIoServer } from "socket.io";

const httpServer = createServer();

const io = new SocketIoServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Map to store the host socket ID for each room
const roomHosts = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-room", (roomId) => {
    if (!roomId || typeof roomId !== "string") {
      socket.emit("error", { message: "Invalid room_id" });
      return;
    }

    // leave any other rooms to enforce only 1 room (except their own private room)
    for (const r of socket.rooms) {
      if (r !== socket.id) {
        socket.leave(r);
      }
    }

    socket.join(roomId);

    setImmediate(() => {
      const room = io.sockets.adapter.rooms.get(roomId);
      const size = room ? room.size : 0;
      let isHost = false;
      if (size === 1) {
        roomHosts.set(roomId, socket.id);
        isHost = true;
      } else {
        isHost = roomHosts.get(roomId) === socket.id;
      }
      socket.emit("host-assigned", isHost);
      console.log(`Socket ${socket.id} joined room ${roomId} | Size: ${size} | IsHost: ${isHost}`);
    });
  });

  socket.on("request_video_status", ({ room_id, requester_socket_id }) => {
    const socketsInRoom = Array.from(io.sockets.adapter.rooms.get(room_id) || []);
    const hostId = socketsInRoom[0];
    if (hostId && requester_socket_id) {
      io.to(hostId).emit("request_video_status", { room_id, requester_socket_id });
    }
  });

  socket.on("video_status_response", ({ room_id, status, target_socket_id }) => {
    if (target_socket_id) {
      io.to(target_socket_id).emit("video_status_update", { status });
    }
  });

  socket.on("video_status_update", ({ room_id, status, target_socket_id }) => {
    if (target_socket_id) {
      io.to(target_socket_id).emit("video_status_update", { status });
    } else if (room_id) {
      socket.to(room_id).emit("video_status_update", { status });
    }
  });

  socket.on("chat_update", ({ room_id, message }) => {
    io.to(room_id).emit("chat_update", { message });
  });

  socket.on("leave-room", (roomId) => {
    if (!roomId || typeof roomId !== "string") {
      socket.emit("error", { message: "Invalid room_id" });
      return;
    }

    const hostId = roomHosts.get(roomId);
    const isHost = hostId === socket.id;
    console.log(`Socket ${socket.id} left room ${roomId}`);

    if (isHost) {
      io.to(roomId).emit("room-closed");
      // Give clients time to process the event, then disconnect all
      setTimeout(() => {
        const socketsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        for (const socketId of socketsInRoom) {
          io.sockets.sockets.get(socketId)?.disconnect(true);
        }
        roomHosts.delete(roomId);
        console.log(`Room ${roomId} closed and all users disconnected as host left.`);
      }, 100);
    }
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // For each room the socket was in
    const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
    for (const roomId of rooms) {
      const hostId = roomHosts.get(roomId);
      const isHost = hostId === socket.id;
      if (isHost) {
        io.to(roomId).emit("room-closed");
        setTimeout(() => {
          const socketsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
          for (const socketId of socketsInRoom) {
            io.sockets.sockets.get(socketId)?.disconnect(true);
          }
          roomHosts.delete(roomId);
          console.log(`Room ${roomId} closed and all users disconnected as host disconnected.`);
        }, 100);
      }
    }
  });
});

const port = process.env.PORT || 8080;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});