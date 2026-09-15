import 'dart:io' show Platform;

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:youtube_player_iframe/youtube_player_iframe.dart';

/// A cued (not autoplaying) YouTube embed, mirroring the original
/// `YouTubePlayerView` usage in the pillar fragments. `webview_flutter`
/// (which `youtube_player_iframe` is built on) only supports
/// Android/iOS/macOS/web, so on Windows/Linux desktop we fall back to a
/// "watch on YouTube" card that opens the video in the system browser.
class YoutubeEmbed extends StatefulWidget {
  const YoutubeEmbed({super.key, required this.videoId, required this.title});

  final String videoId;
  final String title;

  static bool get _embedSupported =>
      kIsWeb || Platform.isAndroid || Platform.isIOS || Platform.isMacOS;

  @override
  State<YoutubeEmbed> createState() => _YoutubeEmbedState();
}

class _YoutubeEmbedState extends State<YoutubeEmbed> {
  YoutubePlayerController? _controller;

  @override
  void initState() {
    super.initState();
    if (YoutubeEmbed._embedSupported) {
      _controller = YoutubePlayerController(
        params: const YoutubePlayerParams(showControls: true, mute: false),
      )..cueVideoById(videoId: widget.videoId);
    }
  }

  @override
  void dispose() {
    _controller?.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = _controller;
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: AspectRatio(
        aspectRatio: 16 / 9,
        child: controller != null
            ? YoutubePlayer(controller: controller)
            : _FallbackCard(videoId: widget.videoId, title: widget.title),
      ),
    );
  }
}

class _FallbackCard extends StatelessWidget {
  const _FallbackCard({required this.videoId, required this.title});

  final String videoId;
  final String title;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: Theme.of(context).cardColor,
      child: InkWell(
        onTap: () => launchUrl(
          Uri.parse('https://www.youtube.com/watch?v=$videoId'),
          mode: LaunchMode.externalApplication,
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.play_circle_fill, size: 48),
              const SizedBox(height: 8),
              Text(title, textAlign: TextAlign.center),
              const SizedBox(height: 4),
              const Text('Watch on YouTube'),
            ],
          ),
        ),
      ),
    );
  }
}
