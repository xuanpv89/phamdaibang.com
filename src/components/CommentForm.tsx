"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { wisp } from "@/lib/wisp";
import { dictionary, type Locale } from "@/lib/i18n";

const buildFormSchema = (locale: Locale) => {
  const validation = dictionary[locale].commentValidation;

  return z.object({
    author: z.string().min(1, validation.nameRequired),
    email: z.string().email(validation.invalidEmail),
    url: z
      .union([z.string().url(validation.invalidUrl), z.string().max(0)])
      .optional(),
    content: z.string().min(1, validation.contentRequired),
    allowEmailUsage: z.boolean(),
  });
};

interface CommentFormProps {
  slug: string;
  config: {
    enabled: boolean;
    allowUrls: boolean;
    allowNested: boolean;
    signUpMessage: string | null;
  };
  parentId?: string;
  locale: Locale;
  onSuccess?: () => void;
}

interface ErrorResponse {
  error: {
    message: string;
  };
}

interface CreateCommentRequest {
  slug: string;
  author: string;
  email: string;
  url?: string;
  content: string;
  allowEmailUsage: boolean;
  parentId?: string;
}

export function CommentForm({
  slug,
  config,
  locale,
  onSuccess,
}: CommentFormProps) {
  const text = dictionary[locale];
  const formSchema = buildFormSchema(locale);
  const { toast } = useToast();
  const { mutateAsync: createComment, data } = useMutation({
    mutationFn: async (input: CreateCommentRequest) => {
      try {
        return await wisp.createComment(input);
      } catch (e) {
        if (e instanceof AxiosError) {
          const errorData = e.response?.data as ErrorResponse | undefined;
          if (errorData?.error?.message) {
            throw new Error(errorData.error.message);
          }
        }
        throw e;
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author: "",
      email: "",
      url: "",
      content: "",
      allowEmailUsage: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createComment({
        ...values,
        slug,
      });
      if (onSuccess) {
        onSuccess();
      }
      form.reset();
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: text.commentErrorTitle,
          description: e.message,
          variant: "destructive",
        });
      }
    }
  };

  if (data && data.success) {
    return (
      <Alert className="bg-muted border-none">
        <AlertDescription className="space-y-2 text-center">
          <Shield className="text-muted-foreground mx-auto h-10 w-10" />
          <div className="font-medium">{text.commentPendingTitle}</div>
          <div className="text-muted-foreground m-auto max-w-lg text-balance text-sm">
            {text.commentPendingDescription}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{text.commentFields.name}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={text.commentFields.namePlaceholder}
                    {...field}
                    className="focus-visible:ring-inset"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{text.commentFields.email}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={text.commentFields.emailPlaceholder}
                    className="focus-visible:ring-inset"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {config.allowUrls && (
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{text.commentFields.website}</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder={text.commentFields.websitePlaceholder}
                    className="focus-visible:ring-inset"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{text.commentFields.comment}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={text.commentFields.commentPlaceholder}
                  className="min-h-[120px] resize-y focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-offset-0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {config.signUpMessage && (
          <FormField
            control={form.control}
            name="allowEmailUsage"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    {config.signUpMessage}
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        )}

        <div className="flex items-center justify-between pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {text.commentSubmit}
          </Button>
        </div>
      </form>
    </Form>
  );
}
