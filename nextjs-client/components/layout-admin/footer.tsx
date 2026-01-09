export function Footer() {
    return (
        <footer className="border-t bg-muted/40 py-4 px-6 dark:bg-card/40">
            <p className="text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} NextGen Admin. All rights reserved.
            </p>
        </footer>
    );
}
