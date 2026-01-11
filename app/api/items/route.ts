import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractWalletFromBody } from '@/lib/auth';

/**
 * POST /api/items
 * Create a new payment item
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, pageId, title, description, type, priceMnee, contentUrl } = body;

    const walletValidation = extractWalletFromBody(body);
    if (!walletValidation.isValid || !walletValidation.address) {
      return NextResponse.json(
        { error: walletValidation.error || 'Invalid wallet address' },
        { status: 400 }
      );
    }

    if (!pageId || typeof pageId !== 'string') {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!type || !['fixed', 'open'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be "fixed" or "open"' },
        { status: 400 }
      );
    }

    // Verify page ownership
    const page = await prisma.paymentPage.findFirst({
      where: {
        id: pageId,
        creatorWallet: walletValidation.address,
      },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Payment page not found or access denied' },
        { status: 404 }
      );
    }

    // Validate fixed price item
    if (type === 'fixed') {
      if (!priceMnee || typeof priceMnee !== 'string' || priceMnee.trim().length === 0) {
        return NextResponse.json(
          { error: 'Price is required for fixed payment items' },
          { status: 400 }
        );
      }
      // Validate price is a valid number
      const priceNum = parseFloat(priceMnee);
      if (isNaN(priceNum) || priceNum <= 0) {
        return NextResponse.json(
          { error: 'Price must be a positive number' },
          { status: 400 }
        );
      }
    }

    // Create payment item
    const item = await prisma.paymentItem.create({
      data: {
        pageId: pageId,
        title: title.trim(),
        description: description?.trim() || null,
        type: type,
        priceMnee: type === 'fixed' ? priceMnee.trim() : null,
        contentUrl: contentUrl?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      item: {
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        priceMnee: item.priceMnee,
        contentUrl: item.contentUrl,
        createdAt: item.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating payment item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
