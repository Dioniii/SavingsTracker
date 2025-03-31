
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // This is where you would handle logout logic
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="finance-logo text-xl">FinTrack</div>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p className="text-center text-gray-500">
              Dashboard content will go here.<br />
              Your finance tracker application is ready!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
