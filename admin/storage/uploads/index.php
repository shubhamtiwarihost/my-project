<?php
// Prevent direct access to storage via web if misconfigured.
http_response_code(403);
exit('Forbidden');
