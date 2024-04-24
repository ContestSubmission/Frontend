<script>
    import AlertTriangle from "lucide-svelte/icons/alert-triangle";
</script>
<div class="w-full flex justify-center items-center text-orange-400">
    <AlertTriangle/>
    <p class="ml-2"><slot/></p>
</div>
