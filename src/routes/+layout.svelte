<script lang="ts">
    import "../app.pcss";
    import { Toaster } from "$lib/components/ui/sonner";
</script>

<svelte:head>
    <style>
        html {
            min-height: 100vh;
            background: radial-gradient(at left top, rgba(125, 20, 36, 0.8), rgba(0, 0, 0, 0.0) 70%),
                radial-gradient(at right top, #6E0692, rgba(0, 0, 0, 0.0) 70%),
            #181c2d no-repeat;
        }
    </style>
</svelte:head>

<Toaster
    closeButton
    richColors
    theme="system"
    style="--toast-close-button-start: unset; --toast-close-button-end: -15px;"
/>

<slot/>
