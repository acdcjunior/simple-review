    <!-- rodape -->
    </div>
    <script>
        $(document).ready(function() {
            // permite HTML na tooltip
            $('.tooltipped').each(function(index, element) {
                var span = $('#' + $(element).attr('data-tooltip-id') + '>span:first-child');
                span.before($(element).attr('data-tooltip'));
                span.remove();
            });
        });
    </script>
</body>
</html>