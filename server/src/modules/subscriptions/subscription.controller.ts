import type { Request, Response } from "express";
import crypto from "crypto";
import prisma from "@/lib/prismaClient.js";
import auth from "@/config/auth.js";
import type { SubscribeSchema } from "./subscription.schema.js";

export const getPlans = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const plans = await prisma.plan.findMany({
      where: { deletedAt: null },
      orderBy: { price: "asc" },
    });

    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error: any) {
    console.error("Prisma Error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

export const subscribe = async (
  req: Request<{}, {}, SubscribeSchema>,
  res: Response,
): Promise<void> => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const userId = session.user.id;
    const { planId } = req.body;

    // Check if plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: planId, deletedAt: null },
    });

    if (!plan) {
      res.status(404).json({ success: false, message: "Plan not found" });
      return;
    }

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        referenceId: userId,
        referenceModel: "user",
        status: "active",
      },
    });

    if (existingSubscription) {
      // Update existing subscription to the new plan
      const updated = await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          planId: plan.id,
          periodStart: new Date(),
          periodEnd: getNextPeriodEnd(plan.interval),
        },
        include: { plan: true },
      });

      res.status(200).json({
        success: true,
        data: updated,
        message: "Subscription updated successfully",
      });
      return;
    }

    // Create new subscription
    const now = new Date();
    const subscription = await prisma.subscription.create({
      data: {
        id: crypto.randomUUID(),
        planId: plan.id,
        referenceId: userId,
        referenceModel: "user",
        status: "active",
        periodStart: now,
        periodEnd: getNextPeriodEnd(plan.interval),
        cancelAtPeriodEnd: false,
      },
      include: { plan: true },
    });

    res.status(201).json({
      success: true,
      data: subscription,
      message: "Subscription created successfully",
    });
  } catch (error: any) {
    console.error("Subscription Error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

export const getMySubscription = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        referenceId: session.user.id,
        referenceModel: "user",
        status: "active",
      },
      include: { plan: true },
    });

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error: any) {
    console.error("Subscription Error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

function getNextPeriodEnd(interval: string): Date {
  const now = new Date();
  switch (interval) {
    case "month":
      return new Date(now.setMonth(now.getMonth() + 1));
    case "year":
      return new Date(now.setFullYear(now.getFullYear() + 1));
    case "lifetime":
      return new Date(now.setFullYear(now.getFullYear() + 100));
    default:
      return new Date(now.setMonth(now.getMonth() + 1));
  }
}
