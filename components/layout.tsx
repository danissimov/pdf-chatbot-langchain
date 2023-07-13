// TypeScript allows us to define custom types. Here we define an interface, which is a custom type that we'll use as props for our Layout component.
// The LayoutProps interface has an optional property 'children' which can be any valid React node (a React element, string, number, null, etc.).
interface LayoutProps {
  children?: React.ReactNode;
}

// Here we define a functional component named 'Layout'. It takes one argument: an object of type 'LayoutProps'.
// This object is destructured to directly access the 'children' prop inside the function.
export default function Layout({ children }: LayoutProps) {
  // The Layout component returns a JSX structure. JSX is a syntax extension for JavaScript that allows us to write HTML-like code inside our JavaScript/TypeScript code.
  return (
    <div className="mx-auto flex flex-col space-y-4">
      <header className="container sticky top-0 z-40 bg-white">
        <div className="h-16 border-b border-b-slate-200 py-4">
          <nav className="ml-4 pl-6 flex justify-between">
            <a href="#" className="hover:text-slate-600 cursor-pointer">
              Home
            </a>
            <img src="/logo.png" alt="Company logo" className="h-12 w-auto mr-4"/>
          </nav>
        </div>
      </header>
      <div>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
