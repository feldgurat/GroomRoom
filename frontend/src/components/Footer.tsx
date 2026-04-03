import { PawPrint } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-sand/30 bg-white/40">
      <div className="w-[min(1100px,calc(100%-32px))] mx-auto min-h-[64px] flex items-center justify-center">
        <div className="flex items-center gap-2 text-mocha/50 text-sm">
          <PawPrint className="w-4 h-4" />
          <span>GroomRoom © {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
