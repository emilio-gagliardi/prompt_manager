'use client'

import React, { useState, useEffect, KeyboardEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CopyIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, CodeIcon, XIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import axiosInstance from '../../api/axiosInstance'

// Mock data for a single prompt
const mockPrompt = {
    id: 1,
    title: "Customer Service Bot",
    description: "A prompt for generating customer service responses",
    category: "Conversational AI",
    tags: "customer service, support, chatbot",
    prompt: "You are a helpful customer service representative for a tech company. Your goal is to assist customers with their inquiries and resolve their issues in a friendly and efficient manner. Please provide a response to the following customer message:\n\n[Customer Message]",
    variables: "[Customer Message]",
    example_output: "Thank you for reaching out to our support team. I understand you're having an issue with [specific problem]. Let me help you with that. First, could you please provide me with your account email address so I can look up your information?",
    notes: "This prompt can be customized for different types of customer service scenarios by modifying the company type and specific instructions."
}
interface Prompt {
    id: number;
    name: string;
    content: string;
    project_id: number;
    created_at: string;
    tags: string[] | null;
    notes: string | null;
}

const tagsStringToArray = (tags: string | null | undefined): string[] => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
};

interface FormFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    fullWidth?: boolean;
    multiline?: boolean;
    disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, value, onChange, fullWidth = false, multiline = false, disabled = false }) => (
    <div className={`mb-4 ${fullWidth ? 'w-full' : 'w-full md:w-1/2'} relative`}>
        <Label htmlFor={name} className="text-sm font-medium text-muted-foreground mb-1 block">
            {label}
        </Label>
        {multiline ? (
            <Textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full min-h-[200px] resize-none pr-10"
                disabled={disabled}
            />
        ) : (
            <Input
                type="text"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full pr-10"
                disabled={disabled}
            />
        )}
        {/* Copy Button */}
        {!disabled && (
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => navigator.clipboard.writeText(value)}
            >
                <CopyIcon className="h-4 w-4" />
            </Button>
        )}
    </div>
)

export default function Page() {
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [promptContent, setPromptContent] = useState<string>("");
    const [variables, setVariables] = useState<{ [key: string]: string }>({});
    const [exampleOutput, setExampleOutput] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const promptId = searchParams.get('id');
    const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
    const [promptIds, setPromptIds] = useState<number[]>([]);
    const router = useRouter();
    const [projectId, setProjectId] = useState<number | null>(null)

    useEffect(() => {
        if (promptId) {
            fetchPrompt(promptId);
        }
    }, [promptId]);



    useEffect(() => {
        if (promptId && promptIds.length > 0) {
            const index = promptIds.findIndex(id => id.toString() === promptId);
            if (index !== -1) {
                setCurrentPromptIndex(index);
            }
        }
    }, [promptId, promptIds]);

    const fetchPromptIds = async (projectId: number) => {
        console.log('Fetching for project:', projectId)
        try {
            const response = await axiosInstance.get<number[]>('/prompts', {
                params: { project_id: projectId }
            });
            console.log('Fetched prompt IDs:', response.data)
            setPromptIds(response.data)
            if (promptId) {
                const index = response.data.findIndex(id => id.toString() === promptId)
                if (index !== -1) {
                    setCurrentPromptIndex(index)
                }
            }
        } catch (err) {
            console.error('Error fetching project prompt IDs:', err)
        }
    };

    const navigateToPrompt = (index: number) => {
        if (index >= 0 && index < promptIds.length) {
            const newPromptId = promptIds[index];
            router.push(`/prompt-editor?id=${newPromptId}`);
        }
    };

    const handlePreviousPrompt = () => {
        navigateToPrompt(currentPromptIndex - 1);
    };

    const handleNextPrompt = () => {
        navigateToPrompt(currentPromptIndex + 1);
    };

    const fetchPrompt = async (id: string) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get<Prompt>(`/prompts/${id}`);
            const promptData = response.data;
            console.log('Fetched prompt data:', promptData);
            setPrompt(promptData);
            setPromptContent(promptData.content);
            const tagsString = Array.isArray(promptData.tags) ? promptData.tags.join(', ') : promptData.tags;
            console.log('Tags string:', tagsString);
            const parsedTags = tagsStringToArray(tagsString);
            console.log('Parsed tags:', parsedTags);
            setTags(parsedTags);
            const initialVariables = parseVariables(promptData.content);
            setVariables(initialVariables);
            setExampleOutput(generateExampleOutput(promptData.content, initialVariables));
            if (promptData.project_id) {
                setProjectId(promptData.project_id)
                fetchPromptIds(promptData.project_id)
            }
        } catch (err) {
            console.error('Error fetching prompt:', err);
            setError('Failed to fetch prompt');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name !== 'content' && name !== 'tags' && name !== 'example_output') {
            setPrompt(prevPrompt => prevPrompt ? { ...prevPrompt, [name]: value } : null);
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setPromptContent(newContent);
        const newVariables = parseVariables(newContent);
        setVariables(newVariables);
        setExampleOutput(generateExampleOutput(newContent, newVariables));
    };

    const handleSave = async () => {
        if (prompt) {
            setIsSaving(true);
            setSaveError(null);
            const promptToSave = {
                ...prompt,
                content: promptContent,
                tags: tags.join(', ')
            };
            try {
                const response = await axiosInstance.put(`/prompts/${prompt.id}`, promptToSave);
                console.log("Prompt saved successfully:", response.data);
                // updateExampleOutput(promptContent, variables);
            } catch (error) {
                console.error("Error saving prompt:", error);
                setSaveError("Failed to save prompt. Please try again.");
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleVariableChange = (key: string, value: string) => {
        const newVariables = { ...variables, [key]: value };
        setVariables(newVariables);
        setExampleOutput(generateExampleOutput(promptContent, newVariables));
    };

    const updateExampleOutput = (content: string, vars?: { [key: string]: string }) => {
        setExampleOutput(generateExampleOutput(content, vars || variables));
    };

    const parseVariables = (content: string): { [key: string]: string } => {
        const regex = /{{(.*?)}}/g;
        const matches = content.match(regex) || [];
        const vars: { [key: string]: string } = {};
        matches.forEach(match => {
            const key = match.replace(/{{|}}/g, '').trim();
            if (key && !(key in vars)) {
                vars[key] = `[${key}]`;
            }
        });
        return vars;
    };

    const generateExampleOutput = (content: string, vars: { [key: string]: string }): string => {
        let output = content;
        for (const key in vars) {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            output = output.replace(regex, vars[key]);
        }
        return output;
    };

    const handleCancel = () => {
        console.log("Cancelling edits");
        // Implement cancel functionality here
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        console.log("Copied to clipboard:", text);
    };

    const handleDownloadJson = () => {
        const jsonString = JSON.stringify(prompt, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${prompt.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        a.click();
    };

    const handleDownloadText = () => {
        if (prompt) {
            const textContent = `
Name: ${prompt.name}

Content:
${promptContent}

Example Output:
${exampleOutput}

Tags: ${tags.join(', ')}

Notes:
${prompt.notes || ''}
            `.trim();
            const blob = new Blob([textContent], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${prompt.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
            a.click();
        }
    };

    const handleInsertAsCode = () => {
        console.log("Inserting prompt as code");
        // Implement insert as code functionality here
    };

    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            e.preventDefault();
            addTag(tagInput.trim());
            setTagInput('');
        }
    };

    const addTag = (tag: string) => {
        if (tag && !tags.includes(tag)) {
            setTags(prevTags => [...prevTags, tag]);
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!prompt) return <div>No prompt found</div>;

    return (
        <div className="flex h-screen bg-background text-foreground">
            <div className="w-full p-4">
                <ScrollArea className="h-[calc(100vh-2rem)]">
                    <Card className="w-full max-w-4xl mx-auto">
                        <CardContent className="p-6">
                            <div className="flex justify-center space-x-4 mb-6">
                                <Button variant="outline" onClick={handleDownloadJson}>
                                    <DownloadIcon className="mr-2 h-4 w-4" />
                                    Download as JSON
                                </Button>
                                <Button variant="outline" onClick={handleDownloadText}>
                                    <DownloadIcon className="mr-2 h-4 w-4" />
                                    Download as Text
                                </Button>
                                <Button variant="outline" onClick={handleInsertAsCode}>
                                    <CodeIcon className="mr-2 h-4 w-4" />
                                    Insert as Code
                                </Button>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                {/* Name Field */}
                                <FormField
                                    label="Name"
                                    name="name"
                                    value={prompt.name}
                                    onChange={handleInputChange}
                                />

                                {/* Tags Input */}
                                <div className="mb-4 w-full relative">
                                    <Label className="text-sm font-medium text-muted-foreground mb-1 block">Tags</Label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {tags.map((tag, index) => (
                                            <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center">
                                                {tag}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-4 w-4 ml-1"
                                                    onClick={() => removeTag(tag)}
                                                >
                                                    <XIcon className="h-3 w-3" />
                                                </Button>
                                            </span>
                                        ))}
                                    </div>
                                    <Input
                                        type="text"
                                        value={tagInput}
                                        onChange={handleTagInputChange}
                                        onKeyDown={handleTagInputKeyDown}
                                        placeholder="Type a tag and press Enter"
                                        className="w-full"
                                    />
                                </div>

                                {/* Content Field */}
                                <FormField
                                    label="Content"
                                    name="content"
                                    value={promptContent} // Bind to promptContent
                                    onChange={handleContentChange} // Use 
                                    fullWidth
                                    multiline
                                />

                                {/* Variables Input */}
                                <div className="mb-4 w-full">
                                    <Label className="text-sm font-medium text-muted-foreground mb-1 block">Variables</Label>
                                    {Object.entries(variables).map(([key, value]) => (
                                        <div key={key} className="mb-2">
                                            <Label htmlFor={key}>{key}</Label>
                                            <Input
                                                id={key}
                                                value={variables[key]}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    handleVariableChange(key, newValue);
                                                }}
                                                placeholder={`Enter value for ${key}`}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Example Output Field */}
                                <FormField
                                    label="Example Output"
                                    name="example_output"
                                    value={exampleOutput}
                                    onChange={() => { }}
                                    fullWidth
                                    multiline
                                    disabled
                                />

                                {/* Notes Field */}
                                <FormField
                                    label="Notes"
                                    name="notes"
                                    value={prompt.notes || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    multiline
                                />

                                <div className="flex justify-end space-x-4 mt-6">
                                    <Button variant="outline" onClick={() => console.log("Cancel edits")}>Cancel</Button>
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>
                                {saveError && <p className="text-red-500">{saveError}</p>}
                            </form>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between items-center mt-6 max-w-4xl mx-auto">
                        <Button variant="ghost" onClick={handlePreviousPrompt} disabled={currentPromptIndex === 0}>
                            <ChevronLeftIcon className="mr-2 h-4 w-4" />
                            Previous Prompt
                        </Button>
                        <Button variant="ghost" onClick={handleNextPrompt} disabled={currentPromptIndex === promptIds.length - 1}>
                            Next Prompt
                            <ChevronRightIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}