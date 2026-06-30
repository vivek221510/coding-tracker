import React from "react";

function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row items">
        <p>© {new Date().getFullYear()} CodingTracker</p>
      </div>
    </footer>
  );
}

export default Footer;
