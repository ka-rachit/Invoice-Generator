import React, {useState, useEffect} from "react";
import {Loader2, Mail, Copy, Check, MessageCircle, Send, Sparkles} from "lucide-react";
import Button from "../ui/Button";
import TextareaField from "../ui/TextAreaField";
import axiosInstance from "../../utils/axiosInstance";
import {API_PATHS} from "../../utils/apiPaths";
import toast from "react-hot-toast";

const ReminderModal = ({isOpen, onClose, invoiceId}) => {
    const [reminderType, setReminderType] = useState("email"); // "email" or "whatsapp"
    const [reminderText, setReminderText] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    // Build the shareable invoice link
    const invoiceViewLink = invoiceId
        ? `${window.location.origin}/invoice/view/${invoiceId}`
        : "";

    const buildLinkHeader = () => {
        return `View your invoice: ${invoiceViewLink}\n\n`;
    };

    useEffect(() => {
        if (isOpen && invoiceId) {
            setHasCopied(false);
            // Prepend the invoice link as default text
            setReminderText(buildLinkHeader());

            const fetchInvoice = async () => {
                try {
                    const response = await axiosInstance.get(API_PATHS.INVOICE.GET_INVOICE_BY_ID(invoiceId));
                    const invoice = response.data;
                    setClientEmail(invoice.billTo?.email || "");
                    setClientPhone(invoice.billTo?.phone || "");
                } catch (err) {
                    console.error("Failed to fetch invoice details", err);
                }
            };
            fetchInvoice();
        }
    }, [isOpen, invoiceId]);

    // When switching tabs, reset the text with the link header
    useEffect(() => {
        if (isOpen && invoiceId) {
            setReminderText(buildLinkHeader());
        }
    }, [reminderType]);

    const handleGenerateWithAI = async () => {
        setIsGenerating(true);
        try {
            const endpoint = reminderType === "email"
                ? API_PATHS.AI.GENERATE_REMINDER
                : API_PATHS.AI.GENERATE_WHATSAPP_REMINDER;
            const response = await axiosInstance.post(endpoint, {invoiceId});
            // Prepend the link header before the AI-generated text
            setReminderText(buildLinkHeader() + response.data.reminderText);
        } catch (err) {
            toast.error(`Failed to generate ${reminderType === "email" ? "email" : "WhatsApp"} reminder with AI`);
            console.error("AI reminder error", err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(reminderText);
        setHasCopied(true);
        toast.success("Reminder Copied to Clipboard !");
        setTimeout(() => setHasCopied(false), 2000);
    };

    const handleAction = () => {
        if (reminderType === "email") {
            if (!clientEmail) {
                toast.error("No email found for this client");
                return;
            }
            let subjectLine = "Invoice Payment Reminder";
            let bodyText = reminderText;
            const match = reminderText.match(/^Subject:\s*(.*)$/m);
            if (match) {
                subjectLine = match[1].trim();
                bodyText = reminderText.replace(/^Subject:\s*.*$/m, "").trim();
            }
            const url = `mailto:${clientEmail}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(bodyText)}`;
            window.open(url, "_blank");
        } else {
            if (!clientPhone) {
                toast.error("No phone number found for this client");
                return;
            }
            const cleanPhone = clientPhone.replace(/[^\d+]/g, "");
            const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(reminderText)}`;
            window.open(url, "_blank");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                <div className="fixed inset-0 bg-black/10 bg-opacity-50 transition-opacity" onClick={onClose}></div>
                
                <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative text-left transform transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                            {reminderType === "email" ? (
                                <Mail className="w-5 h-5 mr-2 text-blue-900" />
                            ) : (
                                <MessageCircle className="w-5 h-5 mr-2 text-emerald-600" />
                            )}
                            Payment Reminder
                        </h3>

                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
                    </div>

                    {/* Mode Tabs */}
                    <div className="flex border-b border-slate-200 mb-4">
                        <button
                            type="button"
                            className={`flex-1 pb-2 text-sm font-semibold border-b-2 transition-colors ${
                                reminderType === "email"
                                    ? "border-blue-900 text-blue-900"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                            onClick={() => setReminderType("email")}
                        >
                            Email Reminder
                        </button>
                        <button
                            type="button"
                            className={`flex-1 pb-2 text-sm font-semibold border-b-2 transition-colors ${
                                reminderType === "whatsapp"
                                    ? "border-emerald-600 text-emerald-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                            onClick={() => setReminderType("whatsapp")}
                        >
                            WhatsApp Reminder
                        </button>
                    </div>

                    {/* Target Information */}
                    <div className="mb-3 text-xs text-slate-500">
                        {reminderType === "email" ? (
                            <span>Sending to: <strong className="text-slate-700">{clientEmail || "No Email Provided"}</strong></span>
                        ) : (
                            <span>Sending to: <strong className="text-slate-700">{clientPhone || "No Phone Provided"}</strong></span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <TextareaField 
                            name="reminderText"
                            value={reminderText}
                            onChange={(e) => setReminderText(e.target.value)}
                            placeholder={reminderType === "email" ? "Write your email reminder here..." : "Write your WhatsApp message here..."}
                            rows={10}
                        />
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={handleGenerateWithAI}
                            isLoading={isGenerating}
                            icon={Sparkles}
                        >
                            Generate with AI
                        </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="secondary" onClick={onClose}>Close</Button>
                        
                        <Button onClick={handleCopyToClipboard} icon={hasCopied ? Check : Copy} disabled={isGenerating || !reminderText}>
                            {hasCopied ? 'Copied' : 'Copy Text'}
                        </Button>
                        
                        <Button 
                            onClick={handleAction} 
                            icon={Send} 
                            disabled={isGenerating || !reminderText || (reminderType === "email" ? !clientEmail : !clientPhone)}
                            className={reminderType === "whatsapp" ? "bg-emerald-600 hover:bg-emerald-700 min-w-fit whitespace-nowrap" : "bg-blue-600 hover:bg-blue-700"}
                        >
                            {reminderType === "email" ? "Send Email" : "Send WhatsApp"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReminderModal;
