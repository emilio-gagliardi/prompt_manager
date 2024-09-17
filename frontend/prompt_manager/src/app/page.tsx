'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusIcon, MoreVerticalIcon, ThumbsUpIcon, ThumbsDownIcon } from 'lucide-react'
import Link from 'next/link'
// Lorem ipsum generator function (255 characters)
const loremIpsum = () => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint".slice(0, 255)

// Mock data for projects and cards
const mockProjects = [
  {
    id: 1,
    title: "Conversational AI",
    cards: [
      { id: 1, label: "Customer Service Bot", description: loremIpsum() },
      { id: 2, label: "Language Translator", description: loremIpsum() },
      { id: 3, label: "Creative Writing Assistant", description: loremIpsum() },
      { id: 4, label: "Code Explanation Bot", description: loremIpsum() },
    ]
  },
  {
    id: 2,
    title: "Data Analysis",
    cards: [
      { id: 5, label: "Market Trend Analyzer", description: loremIpsum() },
      { id: 6, label: "Sentiment Analysis", description: loremIpsum() },
      { id: 7, label: "Data Visualization Prompt", description: loremIpsum() },
      { id: 8, label: "Predictive Modeling Assistant", description: loremIpsum() },
    ]
  }
]

export default function Page() {
  const [projects, setProjects] = useState(mockProjects)

  const handleAddCard = (projectId) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const newCard = {
          id: Date.now(),
          label: "New LLM Prompt",
          description: loremIpsum()
        }
        return { ...project, cards: [...project.cards, newCard] }
      }
      return project
    }))
  }

  const handleCardAction = (action, projectId, cardId) => {
    console.log(`Performing ${action} on card ${cardId} in project ${projectId}`)
    // Implement the actual functionality here
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-border p-4">
        <h2 className="text-2xl font-bold mb-4">LLM Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li><Button variant="ghost" className="w-full justify-start">Home</Button></li>
            <li><Button variant="ghost" className="w-full justify-start">Projects</Button></li>
            <li><Button variant="ghost" className="w-full justify-start">Prompts</Button></li>
            <li><Button variant="ghost" className="w-full justify-start">Settings</Button></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-4">
        <ScrollArea className="h-[calc(100vh-2rem)]">
          {projects.map(project => (
            <section key={project.id} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{project.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Add New Card Button */}
                <Card className="border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleAddCard(project.id)}>
                  <CardContent>
                    <PlusIcon className="w-8 h-8 text-muted-foreground" />
                  </CardContent>
                </Card>

                {/* Project Cards */}
                {project.cards.map(card => (
                  <Card key={card.id} className="flex flex-col hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-3">
                      <Link href={`/prompt-editor?id=${card.id}`}>
                        <CardTitle
                          className="text-sm font-medium cursor-pointer text-primary hover:text-primary/80 active:text-primary/70 transition-colors"
                          onClick={() => console.log(`Clicked on ${card.label}`)}
                        >
                          {card.label}
                        </CardTitle>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCardAction('download', project.id, card.id)}>
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCardAction('insert', project.id, card.id)}>
                            Insert as code
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCardAction('duplicate', project.id, card.id)}>
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCardAction('rename', project.id, card.id)}>
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCardAction('delete', project.id, card.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="py-2 px-3">
                      <p className="text-xs text-muted-foreground line-clamp-4">{card.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-1 py-1 px-2 mt-auto">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsUpIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsDownIcon className="h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}