<script lang="ts">
    import "../app.pcss";
    import { Toaster } from "$lib/components/ui/sonner";
</script>

<svelte:head>
    <style>
        html {
            min-height: 100vh;
            background: radial-gradient(89.33% 89.33% at 100% 10.67%, rgba(212, 25, 118, 0.33) 0%, rgba(212, 25, 118, 0.00) 100%),
            radial-gradient(88.75% 88.75% at 0% 11.25%, rgba(79, 70, 229, 0.33) 0%, rgba(79, 70, 229, 0.00) 100%),
            #242C46 no-repeat;
            background-size: cover;
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
