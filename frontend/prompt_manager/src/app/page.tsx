'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
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
import { useRouter } from 'next/navigation'

interface Prompt {
  id: number;
  name: string;
  content: string;
}

interface ProjectWithPrompts {
  id: number;
  name: string;
  prompts: Prompt[];
}

export default function Page() {
  const [projects, setProjects] = useState<ProjectWithPrompts[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:7070/projects/with-prompts')
        setProjects(response.data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }
    fetchProjects()
  }, [])

  const handleAddCard = (projectId: number) => {
    router.push(`/prompt-editor?project_id=${projectId}`)
  }

  const handleCardAction = (action: string, projectId: number, cardId: number) => {
    console.log(`Performing ${action} on card ${cardId} in project ${projectId}`)
    // Implement the actual functionality here
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--page-background)' }}>
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
              <h3 className="text-xl font-semibold mb-4">{project.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Add New Card Button */}
                <Card className="border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleAddCard(project.id)}>
                  <CardContent>
                    <PlusIcon className="w-8 h-8 text-muted-foreground" />
                  </CardContent>
                </Card>

                {/* Project Cards */}
                {project.prompts.map(prompt => (
                  <Card key={prompt.id} className="flex flex-col hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-3">
                      <Link href={`/prompt-editor?id=${prompt.id}`}>
                        <CardTitle
                          className="text-sm font-medium cursor-pointer text-primary hover:text-primary/80 active:text-primary/70 transition-colors"
                          onClick={() => console.log(`Clicked on ${prompt.name}`)}
                        >
                          {prompt.name}
                        </CardTitle>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCardAction('download', project.id, prompt.id)}>
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCardAction('insert', project.id, prompt.id)}>
                            Insert as code
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCardAction('duplicate', project.id, prompt.id)}>
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCardAction('rename', project.id, prompt.id)}>
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCardAction('delete', project.id, prompt.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="py-2 px-3">
                      <p className="text-xs text-muted-foreground line-clamp-5">{prompt.content}</p>
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