"use client"

import type React from "react"

import { useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import AtomIcon from "@/components/icons/atom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, ImageIcon } from "lucide-react"
import { notFound } from "next/navigation"

interface PredictionResult {
  class: string
  confidence: number
  processing_time: number
}

// Model-specific configurations
const modelConfigs = {
  "deep-feed": {
    name: "DEEP FEED",
    handle: "@FEEDFRWD",
    description: "Advanced neural network for image classification",
    architecture: "ResNet-152",
    inputSize: "224x224 RGB",
    classes: "1000 ImageNet",
    endpoint: "/api/models/deep-feed/predict",
  },
  convulver: {
    name: "CONVULVER",
    handle: "@CONVONN",
    description: "Convolutional neural network specialist",
    architecture: "EfficientNet-B7",
    inputSize: "600x600 RGB",
    classes: "1000 ImageNet",
    endpoint: "/api/models/convulver/predict",
  },
  batchman: {
    name: "BATCHMAN",
    handle: "@BATCHNORMALIZED",
    description: "Batch normalization optimization expert",
    architecture: "DenseNet-201",
    inputSize: "224x224 RGB",
    classes: "1000 ImageNet",
    endpoint: "/api/models/batchman/predict",
  },
}

interface ModelLaboratoryPageProps {
  params: {
    modelId: string
  }
}

export default function ModelLaboratoryPage({ params }: ModelLaboratoryPageProps) {
  const { modelId } = params
  const modelConfig = modelConfigs[modelId as keyof typeof modelConfigs]

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!modelConfig) {
    notFound()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setPrediction(null)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handlePredict = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setError(null)

    try {
      // Convert image to base64
      const base64String = await convertToBase64(selectedFile)

      const requestPayload = {
        image_base64: base64String,
      }

      const response = await fetch(modelConfig.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const result = await response.json()
      setPrediction(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during prediction")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardPageLayout
      header={{
        title: `${modelConfig.name} Laboratory`,
        description: modelConfig.description,
        icon: AtomIcon,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="size-5" />
              Image Upload
            </CardTitle>
            <CardDescription>Upload an image to get predictions from {modelConfig.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-upload">Select Image</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>

            {previewUrl && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto rounded"
                  />
                </div>
              </div>
            )}

            <Button onClick={handlePredict} disabled={!selectedFile || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <AtomIcon className="mr-2 h-4 w-4" />
                  Run Prediction
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="size-5" />
              Prediction Results
            </CardTitle>
            <CardDescription>{modelConfig.name} classification results</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {prediction && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Predicted Class</Label>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {prediction.class}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label>Confidence Score</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${prediction.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono">{(prediction.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Processing Time</Label>
                  <p className="text-sm font-mono text-muted-foreground">{prediction.processing_time.toFixed(3)}s</p>
                </div>
              </div>
            )}

            {!prediction && !error && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>Upload an image and run prediction to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Model Information */}
      <Card>
        <CardHeader>
          <CardTitle>{modelConfig.name} Information</CardTitle>
          <CardDescription>Model specifications and capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide">Architecture</Label>
              <p className="font-mono text-sm">{modelConfig.architecture}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide">Input Size</Label>
              <p className="font-mono text-sm">{modelConfig.inputSize}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide">Classes</Label>
              <p className="font-mono text-sm">{modelConfig.classes}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardPageLayout>
  )
}
