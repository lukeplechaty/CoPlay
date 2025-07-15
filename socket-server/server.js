import { createServer } from "http";
import { Server as SocketIoServer } from "socket.io";

const http_server = createServer();

const io = new SocketIoServer(http_server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-room", (room_id) => {
    if (!room_id || typeof room_id !== "string") {
      socket.emit("error", { message: "Invalid room_id" });
      return;
    }
    socket.join(room_id);
    console.log(`Socket ${socket.id} joined room ${room_id}`);
    console.log("Current sockets in room:", Array.from(io.sockets.adapter.rooms.get(room_id) || []));
    const sockets_in_room = Array.from(io.sockets.adapter.rooms.get(room_id) || []);
    const host_id = sockets_in_room[0];
    const is_host = socket.id === host_id;
    socket.emit("host-assigned", is_host);
    if (is_host) {
      console.log(`Socket ${socket.id} is the host of room ${room_id}`);
    }
    console.log(`Socket ${socket.id} joined room ${room_id}`);
  });

  socket.on("request_video_status", ({ room_id, requester_socket_id }) => {
    console.log(`[Server] Received request_video_status from ${requester_socket_id} for room ${room_id}`);
    const sockets_in_room = Array.from(io.sockets.adapter.rooms.get(room_id) || []);
    const host_id = sockets_in_room[0];
    if (host_id && requester_socket_id) {
      io.to(host_id).emit("request_video_status", { room_id, requester_socket_id });
      console.log(`[Server] Forwarded request_video_status from ${requester_socket_id} to host ${host_id} in room ${room_id}`);
    }
  });

  socket.on("video_status_response", ({ room_id, status, target_socket_id }) => {
    console.log(`[Server] Received video_status_response from host ${socket.id} for room ${room_id}, sending to ${target_socket_id}`);
    if (target_socket_id) {
      io.to(target_socket_id).emit("video_status_update", { status });
      console.log(`[Server] Host ${socket.id} sent initial video_status_update to ${target_socket_id} in room ${room_id}:`, status);
    }
  });

  socket.on("leave-room", (room_id) => {
    if (!room_id || typeof room_id !== "string") {
      socket.emit("error", { message: "Invalid room_id" });
      return;
    }
    socket.leave(room_id);
    const sockets_in_room = Array.from(io.sockets.adapter.rooms.get(room_id) || []);
    if (sockets_in_room.length > 0 && sockets_in_room[0] === socket.id) {
      if (sockets_in_room.length > 1) {
        const new_host_id = sockets_in_room[1];
        io.to(new_host_id).emit("host-assigned", true);
        console.log(`New host assigned: ${new_host_id} for room ${room_id}`);
      } else {
        for (const socket_id of sockets_in_room) {
          if (socket_id !== socket.id) {
            io.to(socket_id).emit("room-closed");
            io.sockets.sockets.get(socket_id)?.disconnect(true);
          }
        }
        console.log(`Room ${room_id} closed because host left.`);
      }
    }
    console.log(`Socket ${socket.id} left room ${room_id}`);
  });

  socket.on("video_status_update", ({ room_id, status }) => {
    const sockets_in_room = Array.from(io.sockets.adapter.rooms.get(room_id) || []);
    console.log(`[Server] Sockets in room ${room_id}:`, sockets_in_room);
    if (room_id) {
    }
    socket.to(room_id).emit("video_status_update", { status });
    console.log(`[Server] Broadcasted video_status_update to room ${room_id}:`, status);
  });

  socket.on("video_status_update", ({ room_id, status, target_socket_id }) => {
    if (target_socket_id) {
      io.to(target_socket_id).emit("video_status_update", { status });
      console.log(`[Server] Host ${socket.id} sent video_status_update to ${target_socket_id} in room ${room_id}:`, status);
    } else {
      socket.to(room_id).emit("video_status_update", { status });
      console.log(`[Server] Broadcasted video_status_update to room ${room_id}:`, status);
    }
  });

  socket.on("disconnect", () => {
    const rooms = Array.from(socket.rooms).filter((room_id) => room_id !== socket.id);
    for (const room_id of rooms) {
      const sockets_in_room = Array.from(io.sockets.adapter.rooms.get(room_id) || []);
      if (sockets_in_room.length > 0 && sockets_in_room[0] === socket.id) {
        if (sockets_in_room.length > 1) {
          const new_host_id = sockets_in_room[1];
          io.to(new_host_id).emit("host-assigned", true);
          console.log(`New host assigned: ${new_host_id} for room ${room_id}`);
        } else {
          for (const socket_id of sockets_in_room) {
            if (socket_id !== socket.id) {
              io.to(socket_id).emit("room-closed");
              io.sockets.sockets.get(socket_id)?.disconnect(true);
            }
          }
          console.log(`Room ${room_id} closed because host disconnected.`);
        }
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

const port = process.env.PORT || 8080;
http_server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});