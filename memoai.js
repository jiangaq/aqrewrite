let body = $response.body;
try {
  let obj = JSON.parse(body || "{}");
  
  obj.activated = true;
  obj.expiresAt = "2099-01-01T00:00:00Z";
  obj.expires_at = "2099-01-01T00:00:00Z";
  obj.device_id = obj.device_id || "mock_device_id";
  obj.instance_name = obj.instance_name || "mock_instance_name";
  obj.instance_id = obj.instance_id || "mock_instance_id";

  $done({ body: JSON.stringify(obj) });
} catch (e) {
  $done({});
}
