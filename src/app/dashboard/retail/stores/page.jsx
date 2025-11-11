'use client';
import React from 'react';
import Card from '../../../../Components/Card.jsx';
import { Button } from '../../../../Components/Button.jsx';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const handleClick = (key) => {
    router.push(`/dashboard/retail/stores/${key}`);
  };

  return (
    <>
          {/* Portal Cards */}
          <div className="grid md:grid-cols-4 gap-8">
            {/* Kehe Portal */}
            <div className="flip-card-container cursor-pointer">
              <div className="flip-card-inner">
                {/* Front Face */}
                <Card variant="glass" className="flip-card-front backdrop-blur-md w-full h-full">
                  <div className="text-center h-full flex flex-col">
                      <img src={'/keheLogo.jpg'} alt="Kehe Logo" className="w-full h-full object-contain" onError={(e)=>{e.currentTarget.style.display='none';}} />
                  </div>
                </Card>
  
                {/* Back Face */}
                <Card variant="glass" className="flip-card-back backdrop-blur-md w-full h-full !p-0">
                  <div className="flex flex-col items-center justify-center flip-card-back-content space-y-4">
                    <Button
                      onClick={() => handleClick('kehe/k-solve')}
                      className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>K-Solve</span>
                    </Button>
                    <Button
                      onClick={() => handleClick('kehe/chain-store')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Chain Store</span>
                    </Button>
                    <Button
                      onClick={() => handleClick('kehe/inventory')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Executive View</span>
                    </Button>
                    <Button
                      onClick={() => handleClick('kehe/ageing')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Ageing</span>
                    </Button>
                    <Button
                      onClick={() => handleClick('kehe/inventory')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Inventory</span>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
  
            {/* SPS Commerce Portal */}
            <div className="flip-card-container cursor-pointer">
              <div className="flip-card-inner">
                {/* Front Face */}
                <Card variant="glass" className="flip-card-front backdrop-blur-md w-full h-full">
                <div className="text-center h-full flex flex-col">
                      <img src={'/spsCommerceLogo.jpg'} alt="Asset Tracker" className="w-full h-full object-contain" onError={(e)=>{e.currentTarget.style.display='none';}} />
                  </div>
                </Card>
  
                {/* Back Face */}
                <Card variant="glass" className="flip-card-back backdrop-blur-md w-full h-full !p-0">
                <div className="flex flex-col items-center justify-center flip-card-back-content space-y-4">
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>K-Solve</span>
                    </Button>
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Chain Store</span>
                    </Button>
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Executive View</span>
                    </Button>
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Ageing</span>
                    </Button>
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Inventory</span>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          

           {/* Cotsco Portal */}
           <div className="flip-card-container cursor-pointer">
              <div className="flip-card-inner">
                {/* Front Face */}
                <Card variant="glass" className="flip-card-front backdrop-blur-md w-full h-full">
                  <div className="text-center h-full flex flex-col">
                      <img src={'/cotscoLogo.jpg'} alt="Kehe Logo" className="w-full h-full object-contain" onError={(e)=>{e.currentTarget.style.display='none';}} />
                  </div>
                </Card>
  
                {/* Back Face */}
                <Card variant="glass" className="flip-card-back backdrop-blur-md w-full h-full !p-0">
                <div className="flex flex-col items-center justify-center flip-card-back-content space-y-4">
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>K-Solve</span>
                    </Button>
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Chain Store</span>
                    </Button>
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Executive View</span>
                    </Button>
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Ageing</span>
                    </Button>
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Inventory</span>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

             {/* Sprouts Portal */}
             <div className="flip-card-container cursor-pointer">
              <div className="flip-card-inner">
                {/* Front Face */}
                <Card variant="glass" className="flip-card-front backdrop-blur-md w-full h-full">
                  <div className="text-center h-full flex flex-col">
                      <img src={'/sproutsLogo.png'} alt="Kehe Logo" className="w-full h-full object-contain" onError={(e)=>{e.currentTarget.style.display='none';}} />
                  </div>
                </Card>
  
                {/* Back Face */}
                <Card variant="glass" className="flip-card-back backdrop-blur-md w-full h-full !p-0">
                <div className="flex flex-col items-center justify-center flip-card-back-content space-y-4">
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>K-Solve</span>
                    </Button>
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Chain Store</span>
                    </Button>
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Executive View</span>
                    </Button>
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Ageing</span>
                    </Button>
                    <Button
                      onClick={() => handlePortalSelect('hrms')}
                       className="w-full max-w-xs bg-white text-black border border-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Inventory</span>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
            </div>
      </>
  );
}


