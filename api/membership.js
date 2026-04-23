export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const rawNumber = req.query.number || '';

  if (!rawNumber) {
    return res.status(400).json({
      success: false,
      message: 'Nomor kosong'
    });
  }

  let number0 = String(rawNumber).replace(/\D/g, '');

  if (number0.startsWith('62')) {
    number0 = '0' + number0.slice(2);
  } else if (number0.startsWith('8')) {
    number0 = '0' + number0;
  }

  if (!/^0\d{8,15}$/.test(number0)) {
    return res.status(400).json({
      success: false,
      message: 'Format nomor tidak valid'
    });
  }

  const url = `https://xl-ku.my.id/end.php?check=circlemembership&number=${encodeURIComponent(number0)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://xl-ku.my.id/',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const text = await response.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return res.status(502).json({
        success: false,
        message: 'Response bendith bukan JSON valid',
        raw: text
      });
    }

    return res.status(200).json(json);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Fetch gagal: ' + error.message
    });
  }
}
