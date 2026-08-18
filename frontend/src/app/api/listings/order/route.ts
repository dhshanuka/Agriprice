import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { listingId, quantityKg, deliveryAddress } = await request.json();

    const qty = parseFloat(quantityKg || 100);

    const order = {
      id: `ord_${Math.random().toString(36).substring(2, 9)}`,
      listingId,
      quantityKg: qty,
      escrowStatus: 'HELD_IN_ESCROW',
      deliveryAddress: deliveryAddress || 'Colombo Wholesale Hub',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        message: 'Order created and payment held securely in AgriPrice Escrow',
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to place escrow order' }, { status: 500 });
  }
}
