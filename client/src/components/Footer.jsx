import React from "react";

function Footer() {
  return (
    <footer className="mt-12 border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-2xl mx-auto px-8 py-6 text-center text-zinc-500">
        © {new Date().getFullYear()} CodingTracker
      </div>
    </footer>
  );
}

export default Footer;
