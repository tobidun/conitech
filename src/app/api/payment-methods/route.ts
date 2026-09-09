import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/typeorm/connection";
import { AppDataSource } from "@/lib/typeorm/data-source";
import { PaymentMethod } from "@/entities/PaymentMethod";
import { User } from "@/entities/User";

// In-memory fallback if database connection is unavailable
export interface PaymentMethodItem {
  id: number;
  cardNumber: string;
  cardLast4: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  cardBrand?: string;
  isDefault: boolean;
  createdAt: string;
}

let memoryPaymentMethods: PaymentMethodItem[] = [];
let nextMemoryId = 1;

function getCardBrand(number: string): string {
  const clean = number.replace(/\s+/g, "");
  if (/^4/.test(clean)) return "Visa";
  if (/^5[1-5]/.test(clean)) return "Mastercard";
  if (/^3[47]/.test(clean)) return "American Express";
  if (/^50|^65|^60/.test(clean)) return "Verve";
  if (/^6011|^65/.test(clean)) return "Discover";
  if (/^35/.test(clean)) return "JCB";
  return "Card";
}

export async function GET() {
  try {
    await connectDatabase();
    const pmRepo = AppDataSource.getRepository(PaymentMethod);
    const paymentMethods = await pmRepo.find({
      order: { createdAt: "DESC" },
    });

    return NextResponse.json({
      success: true,
      paymentMethods,
    });
  } catch (error) {
    console.warn("Database connection unavailable, using memory payment methods:", error);
    return NextResponse.json({
      success: true,
      paymentMethods: memoryPaymentMethods,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cardNumber, expMonth, expYear, cvv, isDefault } = body;

    if (!cardNumber || !expMonth || !expYear || !cvv) {
      return NextResponse.json(
        { success: false, error: "Missing required payment fields (cardNumber, expMonth, expYear, cvv)" },
        { status: 400 }
      );
    }

    const cleanCard = cardNumber.replace(/\s+/g, "");
    const cardLast4 = cleanCard.slice(-4);
    const cardBrand = getCardBrand(cleanCard);

    // Save to memory store first as fallback
    const newMemoryItem: PaymentMethodItem = {
      id: nextMemoryId++,
      cardNumber: cleanCard,
      cardLast4,
      expMonth,
      expYear,
      cvv,
      cardBrand,
      isDefault: Boolean(isDefault),
      createdAt: new Date().toISOString(),
    };
    memoryPaymentMethods.unshift(newMemoryItem);

    // Try saving to database
    try {
      await connectDatabase();
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({
        where: {},
        order: { createdAt: "DESC" },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: "No user found. Please update profile first." },
          { status: 400 }
        );
      }

      const pmRepo = AppDataSource.getRepository(PaymentMethod);
      const newPm = pmRepo.create({
        user,
        userId: user.id,
        cardNumber: cleanCard,
        cardLast4,
        expMonth,
        expYear,
        cvv,
        cardBrand,
        isDefault: Boolean(isDefault),
      });

      const savedPm = await pmRepo.save(newPm);

      return NextResponse.json({
        success: true,
        message: "Payment method saved successfully in database",
        paymentMethod: savedPm,
      });
    } catch (dbError) {
      console.warn("Database save failed, returning memory payment method:", dbError);
      return NextResponse.json({
        success: true,
        message: "Payment method saved successfully (in-memory mode)",
        paymentMethod: newMemoryItem,
      });
    }
  } catch (error) {
    console.error("Error saving payment method:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request payload" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0", 10);

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing payment method id" }, { status: 400 });
    }

    memoryPaymentMethods = memoryPaymentMethods.filter((item) => item.id !== id);

    try {
      await connectDatabase();
      const pmRepo = AppDataSource.getRepository(PaymentMethod);
      await pmRepo.delete(id);
    } catch (dbError) {
      console.warn("Failed to delete from DB, removed from memory:", dbError);
    }

    return NextResponse.json({ success: true, message: "Payment method deleted" });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    return NextResponse.json({ success: false, error: "Delete operation failed" }, { status: 500 });
  }
}
