"use client";

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Counter } from '@/components/Counter'
import { TauriCommands } from '@/components/TauriCommands'
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-background">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Next.js + Tauri デスクトップアプリ</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <Counter />
          </Card>
          
          <TauriCommands />
        </div>
      </div>
    </main>
  )
} 