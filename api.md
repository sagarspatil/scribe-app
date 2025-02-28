## Create transcript

### Endpoint: `POST https://api.elevenlabs.io/v1/speech-to-text`

Transcribe an audio or video file.

#### Request

This endpoint expects a multipart form containing a file.

- **model_id** (string, **Required**): The ID of the model to use for transcription, currently only `scribe_v1` is available.
- **file** (file, **Required**)
- **language_code** (string, Optional): An ISO-639-1 or ISO-639-3 language code corresponding to the language of the audio file. Can sometimes improve transcription performance if known beforehand. Defaults to null (language auto-detected).
- **tag_audio_events** (boolean, Optional, defaults to `true`): Whether to tag audio events like `(laughter)`, `(footsteps)`, etc.
- **num_speakers** (integer, Optional, >=1 and <=32): The maximum number of speakers in the file. Defaults to the maximum supported by the model.
- **timestamps_granularity** (enum, Optional, defaults to `word`): The granularity of timestamps in the transcription, which can be `none`, `word`, or `character`.
- **diarize** (boolean, Optional, defaults to `false`): Whether to annotate the speaker identity in the transcription. If enabled, the maximum duration of input is limited to 8 minutes.

#### cURL Example

```bash
curl -X POST https://api.elevenlabs.io/v1/speech-to-text \
  -H "xi-api-key: <apiKey>" \
  -H "Content-Type: multipart/form-data" \
  -F model_id="<model_id>" \
  -F file=@<file1>
```

#### Response

**Successful Response**

- **language_code** (string): The detected language code (e.g., `eng` for English).
- **language_probability** (double): The confidence score of the language detection (0–1).
- **text** (string): The raw text of the transcription.
- **words** (array of objects): List of words and their timing information.

##### Example

```json
{
  "language_code": "en",
  "language_probability": 0.98,
  "text": "Hello world!",
  "words": [
    {
      "text": "Hello",
      "type": "word",
      "start": 0,
      "end": 0.5,
      "speaker_id": "speaker_1",
      "characters": [
        {
          "text": "text",
          "start": 0,
          "end": 0.1
        }
      ]
    },
    {
      "text": "",
      "type": "spacing",
      "start": 0.5,
      "end": 0.5,
      "speaker_id": "speaker_1",
      "characters": [
        {
          "text": "text",
          "start": 0,
          "end": 0.1
        }
      ]
    },
    {
      "text": "world!",
      "type": "word",
      "start": 0.5,
      "end": 1.2,
      "speaker_id": "speaker_1",
      "characters": [
        {
          "text": "text",
          "start": 0,
          "end": 0.1
        }
      ]
    }
  ]
}
```

**Error (422)**: Speech to Text Convert Request Unprocessable Entity Error