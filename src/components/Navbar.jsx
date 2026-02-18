import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const menuItems = [
    { name: "TCN Agent", href: "#tcn" },
    { name: "Credit Mesh", href: "#mesh" },
    { name: "Final Decision", href: "#decision" },
    { name: "Shopkeeper", href: "#shopkeeper" },
];

export function Navbar({ onNavigate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
            <nav
                className={`mx-auto max-w-7xl px-4 md:px-8 transition-all duration-300 ${scrolled
                    ? "bg-black/40 backdrop-blur-xl border border-white/10 rounded-full mx-4 mt-2"
                    : "bg-transparent border-transparent"
                    }`}
            >
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => onNavigate && onNavigate('home')}
                    >
                        <div className="w-8 h-8 rounded-lg bg-[var(--cyber-green)] flex items-center justify-center text-black font-bold text-xl">P</div>
                        <span className="font-bold text-xl tracking-wider text-white">PurposePay</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {menuItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (item.name === "TCN Agent") onNavigate && onNavigate('tcn');
                                    if (item.name === "Credit Mesh") onNavigate && onNavigate('mesh');
                                    if (item.name === "Final Decision") onNavigate && onNavigate('decision');
                                    if (item.name === "Shopkeeper") onNavigate && onNavigate('shopkeeper');
                                }}
                                className="text-sm font-medium text-gray-300 hover:text-[var(--cyber-green)] transition-colors relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--cyber-green)] transition-all group-hover:w-full"></span>
                            </a>
                        ))}
                        <button
                            onClick={() => onNavigate && onNavigate('dashboard')}
                            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/5"
                        >
                            Login
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/10 py-6 md:hidden rounded-b-2xl shadow-xl"
                        >
                            <div className="flex flex-col items-center gap-6">
                                {menuItems.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (item.name === "TCN Agent") onNavigate && onNavigate('tcn');
                                            if (item.name === "Credit Mesh") onNavigate && onNavigate('mesh');
                                            if (item.name === "Final Decision") onNavigate && onNavigate('decision');
                                            if (item.name === "Shopkeeper") onNavigate && onNavigate('shopkeeper');
                                            setIsOpen(false);
                                        }}
                                        className="text-lg font-medium text-gray-300 hover:text-[var(--cyber-green)]"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                                <button
                                    onClick={() => {
                                        onNavigate && onNavigate('dashboard');
                                        setIsOpen(false);
                                    }}
                                    className="text-lg font-medium text-white hover:text-[var(--cyber-green)]"
                                >
                                    Login
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
