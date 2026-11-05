"use client";
import { CartProvider } from "@/lib/cart";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Story from "@/components/Story";
import Products from "@/components/Products";
import Management from "@/components/Management";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SmoothScroll from "@/components/SmoothScroll";

export default function Page() {
  return (
    <CartProvider>
      <SmoothScroll />
      <div className="grain" aria-hidden />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Story />
        <Products />
        <Marquee dark />
        <Management />
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
