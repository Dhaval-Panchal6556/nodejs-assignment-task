import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Observable, firstValueFrom } from "rxjs";
import {
  ChatHistoryDto,
  ChatListDto,
  SendMessageDto,
} from "../dto/create-chat.dto";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";
import { Users, UsersDocument } from "src/users/schemas/user.schema";

@WebSocketGateway({
  transports: ["websocket", "polling"],
  cors: {
    origin: "*",
  },
})
export class ChatGateway {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chatTrackingServiceClient: any;
  constructor(
    @InjectModel(Users.name)
    private userModel: Model<UsersDocument>
  ) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("events")
  findAll(@MessageBody() data: unknown): Observable<WsResponse<number>> {
    return data as never;
  }

  @SubscribeMessage("identity")
  async identity(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: number
  ): Promise<number> {
    return data;
  }

  @SubscribeMessage("user-connected")
  async UserConnect(
    @MessageBody()
    data: {
      userId: string;
    },
    @ConnectedSocket() socket: Socket
  ): Promise<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rooms: any = await firstValueFrom([] as never);
    if (rooms?.length) {
      rooms.forEach((room) => {
        socket.join(room.roomId.toString());
      });
    }

    return {
      message: "User connected",
    };
  }

  @SubscribeMessage("send-message")
  async sendMessage(@MessageBody() data: SendMessageDto): Promise<unknown> {
    const sendMessageRes = this.chatTrackingServiceClient.send(
      "send_message",
      data
    );

    const sendMessage = await firstValueFrom(sendMessageRes);
    return sendMessage;
  }

  @SubscribeMessage("chat-listing")
  async chatList(
    @MessageBody()
    data: ChatListDto
  ): Promise<unknown> {
    const chatListRes = this.chatTrackingServiceClient.send("chat_list", data);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chatList: any = await firstValueFrom(chatListRes);
    return {
      ...chatList,
      page: { page: data.page, limit: data.limit },
    };
  }

  @SubscribeMessage("chat-history")
  async chatHistory(
    @MessageBody()
    data: ChatHistoryDto
  ): Promise<unknown> {
    const chatHistoryRes = this.chatTrackingServiceClient.send(
      "chat_history",
      data
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chatHistory: any = await firstValueFrom(chatHistoryRes);
    return {
      ...chatHistory,
      page: { page: Number(data.page), limit: Number(data.limit) },
    };
  }

  @SubscribeMessage("unread")
  async unread(): Promise<unknown> {
    return { unReadCount: 0 };
  }

  async logoutUser(socketId: unknown): Promise<unknown> {
    return this.server.to(socketId as never).emit("server-logout");
  }

  async roomConnect(
    @MessageBody()
    roomId: string
  ): Promise<unknown> {
    this.server.socketsJoin(roomId);
    return true;
  }

  connectUsers(roomId: string, socketId: string) {
    const socket = this.server.sockets.sockets.get(socketId);
    if (socket) {
      socket.join(roomId);
    }
  }
}
