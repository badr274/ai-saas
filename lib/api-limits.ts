import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

/**
 * Increases the API usage count for the authenticated user by 1.
 *
 * - If the user already has a record, it increments the `count` field by 1.
 * - If the user doesn't have a record yet, it creates a new one with a count of 1.
 *
 * @returns {Promise<void>}
 */
export const increaseApiLimit = async () => {
  const { userId } = await auth();

  if (!userId) return;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: {
        userId,
      },
      data: { count: userApiLimit.count + 1 },
    });
  } else {
    await prismadb.userApiLimit.create({
      data: { userId, count: 1 },
    });
  }
};

/**
 * Checks if the authenticated user is within their allowed free API usage limit.
 *
 * @returns {Promise<boolean>} Returns `true` if the user can still use the API (hasn't exceeded the limit),
 *                              otherwise returns `false`.
 */
export const checkApiLimit = async () => {
  const { userId } = await auth();

  if (!userId) return false;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};

/**
 * Retrieves the API usage count for the authenticated user.
 * @returns {Promise<number>} The number of API requests used.
 */
export const getApiLimitCount = async () => {
  const { userId } = await auth();

  if (!userId) return 0;
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userApiLimit) return 0;

  return userApiLimit.count;
};
