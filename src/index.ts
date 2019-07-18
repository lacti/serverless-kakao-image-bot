import { api } from "api-gateway-rest-handler";
import { get as httpGet } from "http";
import "source-map-support/register";
import { IImageResult, processImage } from "./image";

export const message = api<MessageEvent>(
  async (req): Promise<MessageResponse> => {
    console.log(`Message`, req);
    if (req.body.type === "text") {
      return {
        message: {
          text: "Please send a picture to me!"
        }
      };
    }

    try {
      const processed = await new Promise<IImageResult>((resolve, reject) =>
        httpGet(req.body.content, incoming =>
          processImage(incoming)
            .then(resolve)
            .catch(reject)
        ).on("error", reject)
      );
      return {
        message: {
          photo: processed
        }
      };
    } catch (error) {
      console.error(`Error`, error);
      // Only for debugging purpose.
      return {
        message: {
          text: error.message
        }
      };
    }
  }
);

export const keyboard = api(req => {
  console.log(`Keyboard`, req);
  // Nothing to do for this bot.
  return {
    type: "text"
  } as KeyboardResponse;
});

export const addFriend = api<FriendEvent>(req => {
  console.log(`AddFriend`, req);
  // Nothing to do for this bot.
  return "";
});

export const deleteFriend = api(req => {
  const { userKey } = req.pathParameters;
  console.log(`DeleteFriend`, req);
  console.log(`UserKey`, userKey);
  // Nothing to do for this bot.
  return "";
});

export const leaveChatRoom = api(req => {
  const { userKey } = req.pathParameters;
  console.log(`LeaveChatRoom`, req);
  console.log(`UserKey`, userKey);
  // Nothing to do for this bot.
  return "";
});
