// src/components/PayosPaymentFlow.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import axios from "axios";

export function PayosPaymentFlow() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  const handleBuy = () => setShowCheckout(true);

  const handlePay = async () => {
    try {
      const res = await axios.post("/api/create-payment", {
        orderCode: "ORDER1234",
        amount: 100000,
        description: "Example Order",
      });
      setQrUrl(res.data.qrCode); // assuming response includes qrCode URL
      setShowQR(true);
    } catch (error) {
      console.error("Payment creation failed", error);
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-md mx-auto">
      <div className="border rounded-2xl shadow-md p-4">
        <h2 className="text-xl font-semibold">Product Name</h2>
        <p className="text-muted-foreground">A short description of the product.</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-green-600">₫100,000</span>
          <Button onClick={handleBuy}>Buy Now</Button>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent>
          <DialogHeader>Checkout</DialogHeader>
          <div className="mt-2 space-y-2">
            <p>Order: <strong>Product Name</strong></p>
            <p>Amount: <strong>₫100,000</strong></p>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handlePay}>Pay with PAYOS</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent>
          <DialogHeader>Scan to Pay</DialogHeader>
          <img src={qrUrl} alt="PAYOS QR" className="mx-auto rounded-xl w-60 h-60" />
          <p className="text-center text-sm mt-4">Use any banking app to scan and pay.</p>
          <div className="flex justify-center mt-4 gap-2">
            <Button variant="secondary" onClick={() => setShowQR(false)}>Cancel</Button>
            <Button>I Already Paid</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
