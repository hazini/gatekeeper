'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from './ui/form';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { api } from '../services/api';
import { SheetHeader, SheetTitle } from './ui/sheet';

const formSchema = z.object({
  domain: z.string()
    .min(1, 'Domain is required')
    .regex(
      /^(\*\.)?[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/,
      'Please enter a valid domain (e.g., example.com, *.example.com)'
    ),
  token: z.string().min(1, 'Token is required'),
  status: z.boolean().default(true),
});

interface LicenseFormProps {
  license?: {
    id: number;
    domain: string;
    token: string;
    status: boolean;
  };
  onSuccess: () => void;
}

export function LicenseForm({ license, onSuccess }: LicenseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: license?.domain || '',
      token: license?.token || '',
      status: license?.status ?? true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      if (license) {
        await api.put(`/licenses/${license.id}`, values);
      } else {
        await api.post('/licenses', values);
      }
      onSuccess();
      form.reset();
    } catch (error: any) {
      console.error('Failed to save license:', error);
      setError(error.response?.data?.message || 'Failed to save license. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle>{license ? 'Edit License' : 'Add License'}</SheetTitle>
      </SheetHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="example.com or *.example.com" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Enter a domain name (e.g., dir.bg, *.rusaliniliev.eu)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter token" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Status</FormLabel>
                  <FormDescription>
                    Enable or disable this license
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {error && (
            <div className="text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {license ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              license ? 'Update License' : 'Create License'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
