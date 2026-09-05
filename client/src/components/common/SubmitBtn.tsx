"use client"

import React from "react";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";

const SubmitBtn: React.FC = () => {

    const { pending } = useFormStatus();
    return <Button className="w-full mt-4" disabled={pending}>
        {pending ? "Processing..." : "Submit"}
    </Button>
}

export default SubmitBtn;