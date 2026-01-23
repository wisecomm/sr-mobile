import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api-client';

export function useExcel() {
    const { toast } = useToast();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const downloadExcel = useCallback(async (url: string, fileName: string, params?: Record<string, string | number | boolean | undefined>) => {
        try {
            setIsDownloading(true);
            // The apiClient returns the data directly due to the interceptor.
            // For a blob response, the 'response' variable will be the Blob itself.
            const response = await apiClient.get<Blob>(url, params, {
                responseType: 'blob',
            });

            if (!response) {
                throw new Error('No data received');
            }

            // Since response IS the blob (because of axios interceptor returning response.data)
            const blob = new Blob([response as unknown as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Excel download failed', error);
            toast({
                title: '다운로드 실패',
                description: '엑셀 다운로드 중 오류가 발생했습니다.',
                variant: 'destructive',
            });
        } finally {
            setIsDownloading(false);
        }
    }, [toast]);

    const uploadExcel = useCallback(async (url: string, file: File, onSuccess?: () => void) => {
        if (!file.name.endsWith('.xlsx')) {
            toast({
                title: '잘못된 파일',
                description: '.xlsx 파일만 업로드할 수 있습니다.',
                variant: 'destructive',
            });
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        setIsUploading(false);

        if (response.code !== '200') {
            toast({
                title: '업로드 실패',
                description: response.message || '엑셀 업로드 중 오류가 발생했습니다.',
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: '업로드 완료',
            description: '엑셀 데이터가 성공적으로 처리되었습니다.',
            variant: 'success',
        });

        onSuccess?.()
    }, [toast]);

    return {
        downloadExcel,
        uploadExcel,
        isDownloading,
        isUploading,
    };
}
