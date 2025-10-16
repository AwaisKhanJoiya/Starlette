import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TermsOfUseDialog = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6 bg-white">
        <DialogHeader className="flex items-start justify-between">
          <DialogTitle className="text-lg font-bold text-dark-gray underline">
            TERMS OF USE
          </DialogTitle>
          {/* <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-5 w-5 text-dark-gray" />
          </button> */}
        </DialogHeader>

        <div className="space-y-4 text-dark-gray text-xs tracking-widest">
          <p className="font-medium">
            BY CREATING AN ACCOUNT ON THE STARLETTE WEBSITE, YOU AGREE TO THE
            FOLLOWING:
          </p>

          <div>
            <h3 className="font-bold underline">PERSONAL USE ONLY</h3>
            <p>
              THE ACCOUNT IS STRICTLY FOR PERSONAL USE. IT MAY NOT BE SHARED.
            </p>
          </div>

          <div>
            <h3 className="font-bold underline">ACCURATE INFORMATION</h3>
            <p>
              YOU AGREE TO PROVIDE ACCURATE, COMPLETE, AND UP-TO-DATE
              INFORMATION WHEN REGISTERING.
            </p>
          </div>

          <div>
            <h3 className="font-bold underline">ACCOUNT SECURITY</h3>
            <p>YOU ARE RESPONSIBLE FOR KEEPING YOUR LOGIN DETAILS SECURE.</p>
          </div>

          <div>
            <h3 className="font-bold underline">
              BOOKING & CANCELLATION POLICY
            </h3>
            <p>
              BOOKINGS CAN BE CANCELLED UP TO 24 HOURS BEFORE THE CLASS STARTS,
              AND UP TO 12 HOURS PRIOR FOR MEMBERS. AFTER THIS WINDOW, THE
              CREDIT WILL AUTOMATICALLY BE DEDUCTED.
            </p>
          </div>

          <div>
            <h3 className="font-bold underline">CLASS PACK VALIDITY</h3>
            <p>
              PURCHASED PACKS HAVE AN EXPIRATION DATE SPECIFIED AT THE TIME OF
              PURCHASE. <span className="font-semibold">NO EXTENSIONS</span>{" "}
              WILL BE GRANTED, EXCEPT IN EXCEPTIONAL CASES.
            </p>
          </div>

          <div>
            <h3 className="font-bold underline">SUBSCRIPTIONS & COMMITMENT</h3>
            <p>
              ALL SUBSCRIPTIONS REQUIRE A MINIMUM COMMITMENT OF 3 MONTHS. A
              ONE-MONTH NOTICE IS REQUIRED TO CANCEL.
            </p>
          </div>

          <div>
            <h3 className="font-bold underline">STUDIO CONDUCT</h3>
            <p>
              RESPECT FOR STAFF, FELLOW CLIENTS, AND EQUIPMENT IS ESSENTIAL. ANY
              INAPPROPRIATE BEHAVIOR MAY RESULT IN SUSPENDED ACCESS TO THE
              STUDIO.
            </p>
          </div>

          <div>
            <h3 className="font-bold underline">
              SAFETY & MANDATORY EQUIPMENT
            </h3>
            <p>
              FOR YOUR SAFETY, GRIP SOCKS ARE MANDATORY DURING ALL SESSIONS.
              SOCKS ARE AVAILABLE FOR PURCHASE{" "}
              <span className="font-semibold">IN THE STUDIO</span>.
            </p>
          </div>

          <div>
            <h3 className="font-bold underline">DATA PRIVACY</h3>
            <p>
              YOUR PERSONAL DATA IS HANDLED WITH STRICT CONFIDENTIALITY, IN
              ACCORDANCE WITH OUR PRIVACY POLICY.
            </p>
          </div>

          <p>
            WITH LOVE, <strong> STARLETTE </strong>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsOfUseDialog;
