import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 h-full bg-gray-100 p-4">
      <nav className="space-y-2">
        <Link
          href="/"
          className={`block px-4 py-2 rounded ${
            isActive('/') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/licenses"
          className={`block px-4 py-2 rounded ${
            isActive('/licenses') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
          }`}
        >
          Licenses
        </Link>
      </nav>
    </div>
  );
}
